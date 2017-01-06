$(document).ready(function () {
    Sand.number = {
        round: function (number, decimalPlaces) {
            decimalPlaces = (!decimalPlaces ? 2 : decimalPlaces);
            return Math.round(number * Math.pow(10, decimalPlaces)) /
                Math.pow(10, decimalPlaces);
        }
    };
});