var ComponentsBootstrapSwitch = function () {

    var handleBootstrapSwitch = function handleBootstrapSwitch() {

        $('.switch-radio1').on('switch-change', function () {
            $('.switch-radio1').bootstrapSwitch('toggleRadioState');
        });

        // or
        $('.switch-radio1').on('switch-change', function () {
            $('.switch-radio1').bootstrapSwitch('toggleRadioStateAllowUncheck');
        });

        // or
        $('.switch-radio1').on('switch-change', function () {
            $('.switch-radio1').bootstrapSwitch('toggleRadioStateAllowUncheck', false);
        });
    };

    return {
        //main function to initiate the module
        init: function init() {
            handleBootstrapSwitch();
        }
    };
}();

jQuery(document).ready(function () {
    ComponentsBootstrapSwitch.init();
});