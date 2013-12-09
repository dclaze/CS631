angular.module('sampleApp')
    .controller('SalaryGridController', function($scope, $http, $modal, $rootScope) {
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
            loadSalaries(date);
        });
        $scope.$watch("filterOptions.paid", function(paid) {
            $scope.payButtonString = paid ? "Paid" : "Pay";
        });

        $rootScope.$on('employeeCreated', function() {
            loadSalaries()
        });

        $scope.onPreviousMonthClick = function() {
            var currentDate = $scope.filterOptions.currentMonth;
            $scope.filterOptions.currentMonth = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
        };
        $scope.onNextMonthClick = function() {
            var currentDate = $scope.filterOptions.currentMonth;
            $scope.filterOptions.currentMonth = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
        };

        $scope.onPaySalaryClick = function() {
            paySalaries();
        };

        $scope.onRefeshSalaryGridClick = function() {
            loadSalaries();
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

        var loadSalaries = function(date) {
            $http({
                method: 'GET',
                url: '/salaries',
                params: {
                    date: $scope.filterOptions.currentMonth
                }
            }).success(function(salaryData, status, headers, config) {
                var formattedSalaryData = salaryData.map(function(item) {
                    item.title_start_date = formatDate(item.title_start_date);
                    for (var i in item) {
                        var field = item[i];
                        if (typeof(field) === "number" && i != "eid")
                            item[i] = formatDollars(field);
                    }
                    return item;
                });

                $scope.salaryData = formattedSalaryData;
                $scope.filterOptions.paid = isPaid(formattedSalaryData);
            }).error(function(data, status, headers, config) {
                console.error("Server returned status ", status, data);
            });
        };

        var paySalaries = function() {
            var salariesToPay = $scope.gridOptions.ngGrid.data;
            $http({
                method: 'POST',
                url: '/paySalaries',
                data: {
                    dateEntered: new Date(),
                    month: $scope.filterOptions.currentMonth.getUTCMonth(),
                    year: $scope.filterOptions.currentMonth.getUTCFullYear(),
                    salariesToPay: salariesToPay
                }
            }).success(function(response, status, headers, config) {
                console.log(response);
            }).error(function(data, status, headers, config) {
                console.error("Server returned status ", status, data);
            });
        };

        $scope.gridOptions = {
            data: 'salaryData',
            filterOptions: $scope.filterOptions,
            rowTemplate: '<div style="height: 100%" ng-class="{red: row.getProperty(\'paid_date\')==null}"><div ng-style="{ \'cursor\': row.cursor }" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell ">' + '<div class="ngVerticalBar" ng-style="{height: rowHeight}" ng-class="{ ngVerticalBarVisible: !$last }"> </div>' + '<div ng-cell></div>' + '</div></div>',
            columnDefs: [{
                field: 'eid',
                displayName: 'Id',
            }, {
                field: 'ename',
                displayName: 'Name'
            }, {
                field: 'title_start_date',
                displayName: 'Hired Date',
            }, {
                field: 'salary',
                displayName: 'Salary'
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
