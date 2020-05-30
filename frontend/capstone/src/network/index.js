class Network {

  constructor(){
    this.commonErrorHandler = this.commonErrorHandler.bind(this)
  }

  commonErrorHandler(res){
    if (res.status == 401){
      if (window){
        window.location = "/sign-in"
      }
    }
    if (res.status == 403){
      alert("권한이 없습니다.")
    }
  }

  network(url, sendObj){
    if (!sendObj.headers){
      sendObj.headers= {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    }

    if (!sendObj.credentials){
      sendObj.credentials= 'include'
    }
    

    if (!sendObj.method) {
      sendObj.method = "POST"
    }

    if ((typeof sendObj.body) != "string"){
      sendObj.body = JSON.stringify(sendObj.body)
    }    
    console.log(sendObj)

    return new Promise((resolve, reject)=>{
      fetch(url, sendObj)
        .then(res=>{
          if (res.status != 200) {
            this.commonErrorHandler(res)
            reject(res)
          }
          resolve(res.json())
        })
        .catch(reject)
    })
  }

}
const network = new Network()
export default network