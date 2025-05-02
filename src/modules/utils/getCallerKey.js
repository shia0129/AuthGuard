
export function getCallerKey() {
    const err = new Error();
    const stackLines = err.stack?.split('\n');
  
    if (stackLines && stackLines.length >= 3) {
      const callerLine = stackLines[2]; // 호출 위치
      const match = callerLine.match(/at (.+?) \((.*):(\d+):\d+\)/) || callerLine.match(/at (.*):(\d+):\d+/);
  
      if (match) {
        const filePath = match[2] || match[1];
        const line = match[3] || match[2];
        const fileName = filePath.split('/').pop();
        return `${fileName}:${line}`;
      }
    }
  
    return `unknown:${Math.random().toString(36).slice(2, 6)}`;
  }
  
