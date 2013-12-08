angular.module('sampleApp')
    .controller('SalaryGridController', function($scope, $http, $modal) {
        var monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        $scope.filterOptions = {
            filterText: '',
            currentMonth: new Date(),
            paid: false
        };
        $scope.$watch("filterOptions.currentMonth", function(date) {
            $scope.currentMonthString = monthNames[date.getUTCMonth()] + " " + date.getUTCFullYear()
            var currentDate = new Date(date);
            // var nextMonth = new Date(currentDate.setMonth()+1)
            // var previousMonth = date.getMonth() != 0 ? date.getMonth() : 11;

            // $scope.previousMonthString = monthNames[previousMonth];
            // $scope.nextMonthString = monthNames[nextMonth];
        });
        $scope.$watch("filterOptions.paid", function(paid) {
            $scope.payButtonString = paid ? "Paid" : "Pay";
        });

        $http({
            method: 'GET',
            url: '/salaries'
        }).success(function(salaryData, status, headers, config) {
            $scope.salaryData = data;
        }).error(function(data, status, headers, config) {
            console.error("Server returned status ", status, data);
        });

        $scope.gridOptions = {
            data: 'salaryData',
            filterOptions: $scope.filterOptions,
            columnDefs: [{
                field: 'eid',
                displayName: 'Id'
            }, {
                field: 'ename',
                displayName: 'Name'
            }, {
                field: 'hired_date',
                displayName: 'Hired Date'
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
            }]
        };
    });
