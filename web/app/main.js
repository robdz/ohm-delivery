angular
  .module("ohm-delivery", [])
  .controller("tracking", function ($scope, $http) {
    $scope.sendData = function () {
      $http.get(`/ohms/${this.trackingId}`).then(
        (result) => {
          const ohmDetails = result.data;
          this.found = true;
          this.name = ohmDetails.client.name;
          this.address = ohmDetails.client.address;
          this.volts = ohmDetails.description.volts;
          this.amperes = ohmDetails.description.amperes;
          this.status = ohmDetails.status;
          this.errorMessage = "";
        },
        (error) => {
          console.log(error);
          this.errorMessage =
            error.data.message ||
            "Oops, this website is under construction, please come back later.";
        }
      );
    };

    $scope.changeStatus = function () {
      $http
        .post(`/ohms/${this.trackingId}`, {
          status: this.status,
        })
        .then(
          (result) => {
            const ohmDetails = result.data;
            this.found = true;
            this.trackingId = ohmDetails.trackingId;
            this.name = ohmDetails.client.name;
            this.address = ohmDetails.client.address;
            this.volts = ohmDetails.description.volts;
            this.amperes = ohmDetails.description.amperes;
            this.status = ohmDetails.status;
            this.errorMessage = "";
          },
          (error) => {
            console.log(error);
            this.errorMessage =
              error.data.message ||
              "Oops, this website is under construction, please come back later.";
          }
        );
    };

    $scope.reorder = function () {
      $http.post(`/ohms/${this.trackingId}/copy`).then(
        (result) => {
          const ohmDetails = result.data;
          this.found = true;
          this.name = ohmDetails.client.name;
          this.address = ohmDetails.client.address;
          this.volts = ohmDetails.description.volts;
          this.amperes = ohmDetails.description.amperes;
          this.status = ohmDetails.status;
          this.errorMessage = "";
        },
        (error) => {
          console.log(error);
          this.errorMessage =
            error.data.message ||
            "Oops, this website is under construction, please come back later.";
        }
      );
    };
  });
