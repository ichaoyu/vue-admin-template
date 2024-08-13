class Log {
  private static console = true;
  log(title: string, text: string) {
    if (!Log.console) return;
    if (import.meta.env.MODE === 'production') return;
    const color = '#fa9841';
    console.log(
      `%c ${title} %c ${text} %c`,
      `font-size:10px;background:${color};border:1px solid ${color};`,
      `font-size:10px;color: ${color};`,
      'background:transparent;',
    );
  }
  closeConsole() {
    Log.console = false;
  }
}
export class EventDispatcher extends Log {
  private listeners: { [type: string]: Function[] } = {};

  protected addEventListener(type: string, listener: Function) {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }
    if (this.listeners[type].indexOf(listener) === -1) {
      this.listeners[type].push(listener);
    }
  }

  protected removeEventListener(type: string) {
    this.listeners[type] = [];
  }

  protected dispatchEvent(type: string, data: any) {
    const listenerArray = this.listeners[type] || [];
    if (listenerArray.length === 0) return;
    listenerArray.forEach((listener) => {
      listener.call(this, data);
    });
  }
}
