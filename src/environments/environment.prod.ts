let apiURL: string = location.origin.includes("localhost") ? "https://oukinternship.dhanushinfotech.com" : location.origin;

export const environment = {
  production: true,
  // serviceUrl: "http://10.10.11.74:8090/api/",
  serviceUrl: `${apiURL}/api/`,
  internUrl: "https://ouk.samvaadpro.com/api/",
  // serviceUrl:"https://lmsqa.dhanushinfotech.com/api/",
  fileUrl: `${apiURL}/`,
  urlFiles: `${apiURL}`,
  internUrlFiles: "https://ouk.samvaadpro.com",
  reportUrl: `${apiURL}/internship/v1/generate`,
  downloadReportUrl: `${apiURL}/internship/v1/download/`,
  SOCKET_ENDPOINT: 'http://localhost:3000',
  SamvaadUrl: 'https://scheduling.samvaad.pro/conference/',
  // RazorPay_Key: 'rzp_test_n9kOog8GmBqfim'//Test
  RazorPay_Key: 'rzp_live_FuIlkhr9QlHKMl'//Live
};
