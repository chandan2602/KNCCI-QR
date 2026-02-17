// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

let apiURL: string = location.origin.includes("localhost") ? "https://oukinternship.dhanushinfotech.com" : location.origin;

export const environment = {
  production: false,
  // serviceUrl: "http://10.10.11.74:8090/api/",
  serviceUrl: `${apiURL}/api/`,
  internUrl: `${'https://oukdev.samvaadpro.com'}/api/`,
  // serviceUrl:"https://lmsqa.dhanushinfotech.com/api/",
  fileUrl: `${apiURL}/`,
  urlFiles: `${apiURL}`,
  internUrlFiles: `${'https://oukdev.samvaadpro.com'}`,
  reportUrl: `${apiURL}/internship/v1/generate`,
  downloadReportUrl: `${apiURL}/internship/v1/download/`,
  SOCKET_ENDPOINT: 'http://localhost:3000',
  SamvaadUrl: 'https://scheduling.samvaad.pro/conference/',
  // RazorPay_Key: 'rzp_test_n9kOog8GmBqfim'//Test
  RazorPay_Key: 'rzp_live_FuIlkhr9QlHKMl'//Live
};
//http://localhost:56608/swagger/index.html
//  serviceUrl:"http://lmsav.dhanushinfotech.com/",https://lmsqa.dhanushinfotech.com

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

