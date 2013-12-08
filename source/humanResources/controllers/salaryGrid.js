angular.module('sampleApp')
    .controller('SalaryGridController', function($scope, $http, $modal, $rootScope) {
        var monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        $scope.filterOptions = {
            filterText: '',
            currentMonth: new Date(),
            paid: false
        };
        $scope.$watch("filterOptions.currentMonth", function(date) {
            $scope.currentMonthString = monthNames[date.getUTCMonth()] + " " + date.getUTCFullYear();
            loadSalaries(date);
        });
        $scope.$watch("filterOptions.paid", function(paid) {
            $scope.payButtonString = paid ? "Paid" : "Pay";
        });

        $rootScope.$on('employeeCreated',function(){
        	alert("GOT IT!");
        });

        $scope.onPreviousMonthClick = function() {
            var currentDate = $scope.filterOptions.currentMonth;
            $scope.filterOptions.currentMonth = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
        };
        $scope.onNextMonthClick = function() {
            var currentDate = $scope.filterOptions.currentMonth;
            $scope.filterOptions.currentMonth = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
        };

        var formatDate = function(date) {
            return date ? new Date(date).toLocaleDateString() : ""
        };
        var formatDollars = function(dollarValue) {
            return dollarValue ? dollarValue.toFixed(2) : 0.00;
        };

        var loadSalaries = function(date) {
            $http({
                method: 'GET',
                url: '/salaries',
                params: {
                    date: $scope.filterOptions.currentMonth
                }
            }).success(function(salaryData, status, headers, config) {
                formattedSalaryData = salaryData.map(function(item) {
                    item.title_start_date = formatDate(item.title_start_date);
                    for (var i in item) {
                        var field = item[i];
                        if (typeof(field) === "number")
                            item[i] = formatDollars(field);
                    }
                });
                $scope.salaryData = salaryData;
            }).error(function(data, status, headers, config) {
                console.error("Server returned status ", status, data);
            });
        };


        $scope.gridOptions = {
            data: 'salaryData',
            filterOptions: $scope.filterOptions,
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
                field: 'hourlyRate',
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
