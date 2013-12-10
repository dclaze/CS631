angular.module('sampleApp')
    .controller('HourlyGridController', function($scope, $http, $modal, $rootScope) {
        var monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        var prepareMonth = function() {
            var date = new Date();
            return new Date(date.getUTCFullYear(), date.getUTCMonth(), 1);
        }

        $scope.filterOptions = {
            filterText: '',
            currentMonth: prepareMonth(),
            paid: false
        };

        $scope.$watch("filterOptions.currentMonth", function(date) {
            $scope.currentMonthString = monthNames[date.getUTCMonth()] + " " + date.getUTCFullYear();
            loadHourlyWages(date);
        });

        $scope.$watch("filterOptions.paid", function(paid) {
            $scope.payButtonString = paid ? "Paid" : "Pay";
        });

        $rootScope.$on('employeeCreated', function() {
            loadHourlyWages();
        });

        $scope.onPreviousMonthClick = function() {
            var currentDate = $scope.filterOptions.currentMonth;
            $scope.filterOptions.currentMonth = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
        };
        $scope.onNextMonthClick = function() {
            var currentDate = $scope.filterOptions.currentMonth;
            $scope.filterOptions.currentMonth = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
        };

        $scope.onPayHourlyClick = function() {
            payHourlyWages();
        };

        $scope.onRefeshSalaryGridClick = function() {
            loadHourlyWages();
        }

        var formatDate = function(date) {
            return date ? new Date(date).toLocaleDateString() : ""
        };
        var formatDollars = function(dollarValue) {
            return dollarValue ? dollarValue.toFixed(2) : 0.00;
        };

        var isPaid = function(salaries) {
            var isPaid = true;
            salaries.forEach(function(salary) {
                if (!salary.paid_date)
                    isPaid = false;
            });
            return isPaid;
        };

        var getUnpaid = function() {
            var wagesToPay = $scope.gridOptions.ngGrid.data;

            return wagesToPay.filter(function(salary) {
                return salary.paid_date == null;
            });
        };

        var loadHourlyWages = function(date) {
            $http({
                method: 'GET',
                url: '/hourlyWages',
                params: {
                    date: $scope.filterOptions.currentMonth
                }
            }).success(function(hourlyWageData, status, headers, config) {
                var formattedHourlyWageData = hourlyWageData.map(function(item) {
                    for (var i in item) {
                        var field = item[i];
                        if (typeof(field) === "number" && i != "eid")
                            item[i] = formatDollars(field);
                    }
                    return item;
                });

                $scope.hourlyWageData = formattedHourlyWageData;
                $scope.filterOptions.paid = isPaid(formattedHourlyWageData);
            }).error(function(data, status, headers, config) {
                console.error("Server returned status ", status, data);
            });
        };

        var payHourlyWages = function() {
            $http({
                method: 'POST',
                url: '/payHourlyWages',
                data: {
                    dateEntered: new Date(),
                    month: $scope.filterOptions.currentMonth.getUTCMonth(),
                    year: $scope.filterOptions.currentMonth.getUTCFullYear(),
                    hourlyWages: getUnpaid()
                }
            }).success(function(response, status, headers, config) {
                loadHourlyWages();
            }).error(function(data, status, headers, config) {
                console.error("Server returned status ", status, data);
            });
        };

        $scope.gridOptions = {
            data: 'hourlyWageData',
            filterOptions: $scope.filterOptions,
            rowTemplate: '<div style="height: 100%" ng-class="{red: row.getProperty(\'paid_date\')==null}"><div ng-style="{ \'cursor\': row.cursor }" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell ">' + '<div class="ngVerticalBar" ng-style="{height: rowHeight}" ng-class="{ ngVerticalBarVisible: !$last }"> </div>' + '<div ng-cell></div>' + '</div></div>',
            columnDefs: [{
                field: 'eid',
                displayName: 'Id',
            }, {
                field: 'ename',
                displayName: 'Name'
            }, {
                field: 'duration',
                displayName: 'Duration(hrs)',
            }, {
                field: 'hour_rate',
                displayName: 'Hourly Rate'
            }, {
                field: 'federalTax',
                displayName: 'Federal (10%)'
            }, {
                field: 'stateTax',
                displayName: 'State (5%)'
            }, {
                field: 'otherTax',
                displayName: 'Other (3%)'
            }, {
                field: 'beforeTax',
                displayName: 'Before Tax'
            }, {
                field: 'afterTax',
                displayName: 'Net Income'
            }]
        };
    });
