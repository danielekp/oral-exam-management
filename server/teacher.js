class Teacher{
  constructor(name, password, id){
    if(id)
      this.id = id;
    this.name = name;
    this.password = password;
  }
}

module.exports = Teacher;
