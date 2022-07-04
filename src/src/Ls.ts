class LsClass {
  get brewLocation() {
    return localStorage.getItem("brewLocation") || "/usr/local/bin/brew"
  }

  set brewLocation(s: string) {
    localStorage.setItem("brewLocation", s)
  }


  get stdoutMaxBuffer(): number {
    const Mag1 = 1024 * 1024
    return Number(localStorage.getItem("stdoutMaxBuffer")) || Mag1 * 4
  }

  set stdoutMaxBuffer(s: number) {
    localStorage.setItem("stdoutMaxBuffer", s.toString())
  }

  private _getBoolLocalStorage(key: string) {
    const i = localStorage.getItem(key);
    if (i === null) {
      return false;
    }
    return Boolean(JSON.parse(i));
  }

  get caskVisible(): boolean {
    return this._getBoolLocalStorage("caskVisible")
  }

  set caskVisible(s: boolean) {
    localStorage.setItem("caskVisible", JSON.stringify(s))
  }


  get formulaVisible(): boolean {
    return this._getBoolLocalStorage("formulaVisible")
  }

  set formulaVisible(s: boolean) {
    localStorage.setItem("formulaVisible", JSON.stringify(s))
  }

  get servicesVisible(): boolean {
    return this._getBoolLocalStorage("servicesVisible")
  }

  set servicesVisible(s: boolean) {
    localStorage.setItem("servicesVisible", JSON.stringify(s))
  }


}

export const Ls = new LsClass();