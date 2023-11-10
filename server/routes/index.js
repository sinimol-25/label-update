module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: 'myController.index',
    config: {
      policies: [],
    },
  },
  {
    // Path defined with a URL parameter
    method: "GET",
    path: "/update-label",
    handler: "myController.updateLabel",
    config: {
      auth: false,
    },
  }
];
