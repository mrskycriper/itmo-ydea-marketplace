const SuperTokens = () => {
  supertokens.init({
    apiDomain: window.location.origin,
    apiBasePath: '/auth',
    // onHandleEvent: (context) => {
    //   console.log(context);
    //
    //   if (context.action === 'UNAUTHORISED') {
    //     // called when the user doesn't have a valid session but made a request that requires one
    //     // NOTE: This event can fire multiple times
    //     window.location.href = '/login';
    //
    //     if (context.sessionExpiredOrRevoked) {
    //       // the sessionExpiredOrRevoked property is set to true if the current call cleared the session from storage
    //       // this happens only once, even if multiple tabs sharing the same session are open, making it useful for analytics purposes
    //       window.location.href = '/login';
    //     }
    //   }
    // },
  });
};

SuperTokens();
