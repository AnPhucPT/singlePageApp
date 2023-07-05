function loginController(app) {
    app.controller('loginController', function ($scope, $http) {
        $scope.form = {
            email: '',
            password: '',
        };
        $scope.login = () => {
            $http
                .post('http://localhost:8080/api/public/accounts', {
                    ...$scope.form,
                })
                .then((res) => {
                    const data = res.data;
                    if (data.success) {
                        localStorage.setItem('access_token', data.message);
                        localStorage.setItem('user', JSON.stringify(data.data));
                        $scope.user = data.data;
                        window.open('#!/', '_self');
                    }
                })
                .catch((err) => {
                    Promise.reject(err);
                });
        };
    });
}

export default loginController;
