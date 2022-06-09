class LsClass {
  get brewLocation(){
    return localStorage.getItem("brewLocation") || "/usr/local/bin/brew"
  }

  set brewLocation(s: string){
    localStorage.setItem("brewLocation",s)
  }
}

export const Ls = new LsClass();