export function getServerEndpoint() {
  let serverEndpoint = "localhost:10000/";  /*'localhost:3005/'*/ /* 'iahmed:3005/' */ /*"172.19.91.147:4001/"*/
  console.log(process.env.NODE_ENV);
  if (process.env.NODE_ENV === "production") {
    serverEndpoint = window.location.host + "/"; //window.location.protocol + '//'+ window.location.host +'/';
  }

  return serverEndpoint;
}
