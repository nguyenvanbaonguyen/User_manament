const TokenScheme = {
  type: "object",
  properties: {
    accessToken: {
      example:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2ODA2ODQ4MzYsImV4cCI6MTcxNjY4NDgzNn0.AZ7iIZWUIA4Gtcz7xFojY0nKYSk1PvGhLOtfBluLByg",
    },
    expiredAccessToken: {
      type: "string",
      example: "1680720836045",
    },
    refreshToken: {
      type: "string",
      example:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2ODA2ODQ4MzYsImV4cCI6MjU0NDY4NDgzNn0.hSfLw4nwRid3SGkLQDcGFWiZRNUDVYrpTcL4OXcsXH",
    },
    expiredFreshToken: {
      type: "string",
      example: "1681548836045",
    },
  },
};

module.exports = TokenScheme;
