class LsClass {
  get brewLocation(){
    return localStorage.getItem("brewLocation") || "/usr/local/bin/brew"
  }

  set brewLocation(s: string){
    localStorage.setItem("brewLocation",s)
  }

  
  get stdoutMaxBuffer(): number{
    const Mag1 = 1024 * 1024
    return Number(localStorage.getItem("stdoutMaxBuffer")) || Mag1 * 4
  }

  set stdoutMaxBuffer(s: number){
    localStorage.setItem("stdoutMaxBuffer",s.toString())
  }

}

export const Ls = new LsClass();