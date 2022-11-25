export function getServerEndpoint() {

  return window.location.protocol + '//' + getServerEndpointNoProtocol();

}

export function getServerEndpointNoProtocol() {
  let serverEndpoint = "localhost:4010/"; /*'localhost:3005/'*/ /* 'iahmed:3005/' */ /*"172.19.91.147:4001/"*/
  if (process.env.NODE_ENV === "production") {
    serverEndpoint = window.location.host + "/"; //window.location.protocol + '//'+ window.location.host +'/';
  }

  return serverEndpoint;
}
