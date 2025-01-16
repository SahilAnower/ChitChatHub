export const nginxCurrentServer = async (req, res, next) => {
  console.info(`Request routed to server - ${process.env.SERVER_ID}`);
  next();
};
