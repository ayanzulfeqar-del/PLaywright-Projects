module.exports = {
  default: {
    paths: ['tests/features/EcommerceWebClient.feature'],
    require: [
      'tests/features/step_definations/*.js',
      'tests/features/support/*.js',
    ],
    format: ['progress', 'html:cucumber-report.html'],
  },
};
