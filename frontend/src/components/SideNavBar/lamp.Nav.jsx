
// import { road } from "react-icons-kit/icomoon/road";
 import {forrst} from 'react-icons-kit/ikons/forrst'
//import pole from "../../images/pole.png";
export const NavTimpsWraper = [
  {
    navId: "assets",
    navIndex: 7,
    navIcon: forrst,
    navText: "Assets",
    permissionCheckFirstArg: "ASSET",
    permissionCheckSecondArg: "view",
    permissionCheck: false,
  },
];

// class NavTimps extends React.Component {
//   constructor(props) {
//     super(props);
//     this.navBarItemsTImps = [
//       {
//         navId: "assets",
//         navIcon: road,
//         navText: "Assets",
//         permissionCheckFirstArg: "TRACK",
//         permissionCheckSecondArg: "view",
//         permissionCheck: true
//       }
//     ];
//   }
//   render() {
//     //  console.log(this.props.history);
//     let NavStr = this.navBarItemsTImps.map((item, index) => {
//       let obj = null;
//       if (item.permissionCheck) {
//         obj = permissionCheck(
//           item.permissionCheckFirstArg,
//           item.permissionCheckSecondArg
//         ) && (
//           <Nav
//             id={item.navId}
//             key={item.navId}
//             onClick={e => {
//               this.props.history.push(item.navId);
//             }}
//           >
//             <NavIcon>
//               <SvgIcon
//                 size={item.iconSize ? item.iconSize : 20}
//                 icon={item.navIcon}
//               />
//             </NavIcon>
//             <NavText style={{ textTransform: "uppercase" }}>
//               {languageService(item.navText)}
//             </NavText>
//           </Nav>
//         );
//       } else {
//         obj = (
//           <Nav id={item.navId} key={item.navId}>
//             <NavIcon>
//               <SvgIcon
//                 size={item.iconSize ? item.iconSize : 20}
//                 icon={item.navIcon}
//               />
//             </NavIcon>
//             <NavText style={{ textTransform: "uppercase" }}>
//               {item.navText}
//             </NavText>
//           </Nav>
//         );
//       }

//       return obj;
//     });
//     return NavStr;
//   }
// }

// // let navItemsReactComp = navBarItemsTImps.map((item, index) => {
// //   let obj = null;
// //   if (item.permissionCheck) {
// //     obj = permissionCheck(
// //       item.permissionCheckFirstArg,
// //       item.permissionCheckSecondArg
// //     ) && (
// //       <Nav id={item.navId} key={item.navId}>
// //         <NavIcon>
// //           <SvgIcon
// //             size={item.iconSize ? item.iconSize : 20}
// //             icon={item.navIcon}
// //           />
// //         </NavIcon>
// //         <NavText style={{ textTransform: "uppercase" }}>
// //           {" "}
// //           {item.navText}{" "}
// //         </NavText>
// //       </Nav>
// //     );
// //   } else {
// //     obj = (
// //       <Nav id={item.navId} key={item.navId}>
// //         <NavIcon>
// //           <SvgIcon
// //             size={item.iconSize ? item.iconSize : 20}
// //             icon={item.navIcon}
// //           />
// //         </NavIcon>
// //         <NavText style={{ textTransform: "uppercase" }}>
// //           {" "}
// //           {item.navText}{" "}
// //         </NavText>
// //       </Nav>
// //     );
// //   }

// //   return obj;
// // });

// if (!timpsModule) {
//   NavTimps = null;
// }

// export const NavTimpsWraper = withRouter(NavTimps);
