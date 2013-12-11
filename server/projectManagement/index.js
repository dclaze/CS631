var q = require('q');

var teamFromTeamDTO = function(createTeamDTO) {
    return {
        tname: createTeamDTO.teamName,
        manager_id: createTeamDTO.managerId,
    };
};

var teamWorkersFromTeamDTO = function(createTeamDTO, teamId) {
    return createTeamDTO.employeeIds.map(function(employeeId) {
        return {
            employee_id: employeeId,
            team_id: teamId
        }
    })
};

var createTeamWithTeamWorkers = function(teamModel, teamWorkersModel, createTeamDTO) {
    var deferred = q.defer();
    var teamEntity = teamFromTeamDTO(createTeamDTO);
    console.log(teamEntity);
    teamModel.create(teamEntity)
        .success(function(team) {
            console.log(team);
            var teamId = team.tid,
                teamWorkers = teamWorkersFromTeamDTO(createTeamDTO, teamId);
            teamWorkersModel.bulkCreate(teamWorkers)
                .success(function(teamworkers) {
                    deferred.resolve([team, teamworkers]);
                })
                .error(function(error) {
                    deferred.reject(error);
                });
        })
        .error(function(error) {
            deferred.reject(error);
        });
    return deferred.promise;
};

var teamQueryBuilder = function() {
    return ["SELECT T.tid, T.tname as teamName, T.project_id as projectId, E.ename as managerName, E.eid as managerId, P.PNAME as projectName",
        "FROM TEAM T",
        "LEFT JOIN EMPLOYEE E ON T.MANAGER_ID = E.EID",
        "LEFT JOIN PROJECT P ON T.PROJECT_ID = P.PID"
    ].join(" ");
}

var getAllTeams = function(sqlConnector, teamModel) {
    var deferred = q.defer();

    sqlConnector.query(teamQueryBuilder())
        .success(function(teams) {
            var teamGridRows = teams.map(function(team) {
                return {
                    tid: team.tid,
                    tname: team.teamName,
                    managerId: team.managerId,
                    managerName: team.managerName,
                    projectName: team.projectName
                };
            })
            deferred.resolve(teamGridRows);
        })
        .failure(function(error) {
            deferred.reject(error);
        });

    return deferred.promise;
};

var projectFromProjectDTO = function(createProjectDTO) {
    return {
        pname: createProjectDTO.projectName,
        manager_id: createProjectDTO.managerId,
        start_date: new Date(createProjectDTO.startDate),
        end_date: new Date(createProjectDTO.endDate),
        budget: createProjectDTO.budget,
        department_id: createProjectDTO.department_id
    };
};

var createProjectAndAssignTeam = function(projectModel, teamModel, createProjectDTO) {
    var deferred = q.defer();
    var projectEntity = projectFromProjectDTO(createProjectDTO);
    projectModel.create(projectEntity)
        .success(function(newProject) {
            var projectId = newProject.pid;
            teamModel.find({
                where: 'tid=' + createProjectDTO.teamId
            }).success(function(team) {
                team.updateAttributes({
                    project_id: projectId
                }).success(function(updatedTeam) {
                    deferred.resolve([updatedTeam, newProject]);
                }).error(function(error) {
                    deferred.reject(error);
                });
            }).error(function(error) {
                deferred.reject(error);
            })
        })
        .error(function(error) {
            deferred.reject(error);
        });

    return deferred.promise;
};


var getProjects = function(projectModel) {
    var deferred = q.defer();
    projectModel.findAll()
        .success(function(projects) {
            deferred.resolve(projects);
        })
        .error(function(error) {
            deferred.reject(error);
        });
    return deferred.promise;
};


// SELECT T.tid, T.tname as teamName, E.ename as managerName, E.eid as managerId, P.PNAME as projectName
// FROM TEAM T
// LEFT JOIN EMPLOYEE E ON T.MANAGER_ID = E.EID
// LEFT JOIN PROJECT P ON T.PROJECT_ID = P.PID

var numberOfEmployeesQueryBuilder = function(projectId) {
    return ["SELECT COUNT(TW.EMPLOYEE_ID) AS numberOfEmployees",
        "FROM PROJECT P, TEAM T, TEAMWORKERS TW",
        "WHERE P.PID = T.PROJECT_ID",
        "AND T.TID = TW.TEAM_ID",
        "AND P.PID =",
        projectId
    ].join(" ");
}

var getNumberOfEmployeesOnProject = function(sqlConnector, projectId) {
    var deferred = q.defer();
    sqlConnector.query(numberOfEmployeesQueryBuilder(projectId))
        .success(function(result) {
            deferred.resolve(result[0]);
        })
        .error(function(error) {
            deferred.reject(error);
    });
    return deferred.promise;
};


var getTotalPersonHoursOnProject = function(sqlConnector, projectId){

};

module.exports = function(app, database) {
    // List of Teams PID CAN BE NULL / TEAM ID / TEAM NAME / MAN HOURS / MANAGER ID (EMPLOYEE ID)
    app.get('/teams', function(request, response) {
        var sqlConnector = app.get('sequelize');
        var teamModel = request.app.get('models').team;
        response.send(getAllTeams(sqlConnector, teamModel));
    });

    app.post('/createTeam', function(request, response) {
        var teamModel = request.app.get('models').team,
            teamWorkersModel = request.app.get('models').teamworkers,
            createTeamDTO = request.body;

        console.log(request.body);
        var result = createTeamWithTeamWorkers(teamModel, teamWorkersModel, createTeamDTO);
        response.send(result);
    });

    app.get('/projects', function(request, response) {
        var projectModel = request.app.get('models').project;
        response.send(getProjects(projectModel));
    });

    app.get('/project/numberOfEmployees', function(request, response) {
        var projectId = request.query.projectId;
        var sqlConnector = app.get('sequelize');
        response.send(getNumberOfEmployeesOnProject(sqlConnector, projectId));
    });

    app.get('/project/totalPersonHours', function(request, response) {
        var projectId = request.query.projectId;
        var sqlConnector = app.get('sequelize');
        response.send(getTotalPersonHoursOnProject(sqlConnector, projectId));
    });

    app.post('/createProject', function(request, response) {
        var projectModel = request.app.get('models').project,
            teamModel = request.app.get('models').team,
            createProjectDTO = request.body;

        console.log(request.body, request.body.startDate, request.body.endDate);
        var result = createProjectAndAssignTeam(projectModel, teamModel, createProjectDTO);
        response.send(result);
    });
};
