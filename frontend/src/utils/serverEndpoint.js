export function getServerEndpoint() {
  let serverEndpoint = "localhost:4001/";  /*'localhost:3005/'*/ /* 'iahmed:3005/' */ /*"172.19.91.147:4001/"*/
  if (process.env.NODE_ENV === "production") {
    serverEndpoint = window.location.host + "/"; //window.location.protocol + '//'+ window.location.host +'/';
  }

  return serverEndpoint;
}
