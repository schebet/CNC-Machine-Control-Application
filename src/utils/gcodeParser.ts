export interface GCodeCommand {
  type: 'G' | 'M' | 'F' | 'S' | 'T';
  code: number;
  parameters: { [key: string]: number };
  line: number;
  raw: string;
}

export interface Position {
  x: number;
  y: number;
  z: number;
}

export interface MachineState {
  position: Position;
  feedRate: number;
  spindleSpeed: number;
  spindleOn: boolean;
  absoluteMode: boolean;
  units: 'mm' | 'inch';
  currentTool: number;
}

export class GCodeParser {
  private state: MachineState = {
    position: { x: 0, y: 0, z: 0 },
    feedRate: 100,
    spindleSpeed: 0,
    spindleOn: false,
    absoluteMode: true,
    units: 'mm',
    currentTool: 1
  };

  parseGCode(gcode: string): GCodeCommand[] {
    const lines = gcode.split('\n');
    const commands: GCodeCommand[] = [];

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine.startsWith(';') || trimmedLine.startsWith('(')) {
        return; // Skip comments and empty lines
      }

      const command = this.parseLine(trimmedLine, index);
      if (command) {
        commands.push(command);
      }
    });

    return commands;
  }

  private parseLine(line: string, lineNumber: number): GCodeCommand | null {
    const upperLine = line.toUpperCase();
    const matches = upperLine.match(/([GMT])(\d+(?:\.\d+)?)/);
    
    if (!matches) return null;

    const type = matches[1] as 'G' | 'M' | 'T';
    const code = parseFloat(matches[2]);
    const parameters: { [key: string]: number } = {};

    // Extract parameters (X, Y, Z, F, S, etc.)
    const paramMatches = upperLine.matchAll(/([XYZFSPIJKR])(-?\d+(?:\.\d+)?)/g);
    for (const match of paramMatches) {
      parameters[match[1]] = parseFloat(match[2]);
    }

    return {
      type,
      code,
      parameters,
      line: lineNumber,
      raw: line
    };
  }

  simulateCommand(command: GCodeCommand): Partial<MachineState> {
    const newState: Partial<MachineState> = {};

    switch (command.type) {
      case 'G':
        switch (command.code) {
          case 0: // Rapid positioning
          case 1: // Linear interpolation
            if (command.parameters.X !== undefined || 
                command.parameters.Y !== undefined || 
                command.parameters.Z !== undefined) {
              
              const newPosition = { ...this.state.position };
              
              if (this.state.absoluteMode) {
                if (command.parameters.X !== undefined) newPosition.x = command.parameters.X;
                if (command.parameters.Y !== undefined) newPosition.y = command.parameters.Y;
                if (command.parameters.Z !== undefined) newPosition.z = command.parameters.Z;
              } else {
                if (command.parameters.X !== undefined) newPosition.x += command.parameters.X;
                if (command.parameters.Y !== undefined) newPosition.y += command.parameters.Y;
                if (command.parameters.Z !== undefined) newPosition.z += command.parameters.Z;
              }
              
              newState.position = newPosition;
            }
            
            if (command.parameters.F !== undefined) {
              newState.feedRate = command.parameters.F;
            }
            break;

          case 17: // XY plane selection
          case 18: // XZ plane selection
          case 19: // YZ plane selection
            // Plane selection doesn't change machine state for simulation
            break;

          case 20: // Inch units
            newState.units = 'inch';
            break;

          case 21: // Metric units
            newState.units = 'mm';
            break;

          case 28: // Return to home position
            newState.position = { x: 0, y: 0, z: 0 };
            break;

          case 90: // Absolute positioning
            newState.absoluteMode = true;
            break;

          case 91: // Relative positioning
            newState.absoluteMode = false;
            break;

          case 94: // Feed rate per minute
            // Feed rate mode doesn't change state for simulation
            break;
        }
        break;

      case 'M':
        switch (command.code) {
          case 3: // Spindle on clockwise
            newState.spindleOn = true;
            if (command.parameters.S !== undefined) {
              newState.spindleSpeed = command.parameters.S;
            }
            break;

          case 4: // Spindle on counterclockwise
            newState.spindleOn = true;
            if (command.parameters.S !== undefined) {
              newState.spindleSpeed = command.parameters.S;
            }
            break;

          case 5: // Spindle stop
            newState.spindleOn = false;
            newState.spindleSpeed = 0;
            break;

          case 30: // Program end
            newState.spindleOn = false;
            newState.spindleSpeed = 0;
            break;
        }
        break;

      case 'T':
        newState.currentTool = command.code;
        break;
    }

    // Update internal state
    Object.assign(this.state, newState);
    
    return newState;
  }

  getState(): MachineState {
    return { ...this.state };
  }

  reset() {
    this.state = {
      position: { x: 0, y: 0, z: 0 },
      feedRate: 100,
      spindleSpeed: 0,
      spindleOn: false,
      absoluteMode: true,
      units: 'mm',
      currentTool: 1
    };
  }
}