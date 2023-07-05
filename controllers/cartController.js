function cartController(app) {
    app.controller(
        'cartController',
        function ($scope, $http, $rootScope, $timeout, cartService) {
            $scope.removeProduct = null;
            $scope.products = cartService.getCartFromLS();
            $rootScope.removeProductItem = () => {
                if ($scope.removeProduct) {
                    $scope.products = $scope.products.filter(
                        (item) => item.id !== $scope.removeProduct.id,
                    );
                }
                cartService.setCartToLS($scope.products);
                $rootScope.hideModal();
            };

            $rootScope.modal = $rootScope.initModal('#deleteModal');

            $rootScope.showModal = () => {
                $rootScope.modal.show();
            };

            $rootScope.hideModal = () => {
                $rootScope.modal.hide();
            };

            $rootScope.setRemoveProduct = (product) => {
                $rootScope.showModal();
                $scope.removeProduct = product;
            };

            $scope.submit = () => {
                $rootScope.loading = true;
                console.log(localStorage.getItem('access_token'));
                const shipFee = $scope.getTax();
                const orderItemDTOS = $scope.products.map((product) => ({
                    quantity: product.quantity,
                    product,
                }));
                const address = 'HCM';
                const formData = { shipFee, orderItemDTOS, address };
                $http
                    .post('http://localhost:8080/api/order', formData, {
                        headers: {
                            Authorization:
                                'Bearer ' +
                                    localStorage.getItem('access_token') || '',
                        },
                    })
                    .then((res) => {
                        const data = res.data;
                        if (data.success) {
                            $scope.products = [];
                            cartService.setCartToLS([]);
                        }
                    })
                    .catch((err) => {
                        Promise.reject(err);
                    })
                    .finally(() =>
                        $timeout(function () {
                            $rootScope.loading = false;
                        }, 300),
                    );
            };

            $scope.getTotalPrice = () => {
                return $scope.products.reduce(
                    (acc, curr) => acc + curr.quantity * curr.price,
                    0,
                );
            };

            $scope.getTotalQuantity = () => {
                return $scope.products.reduce(
                    (acc, curr) => acc + curr.quantity,
                    0,
                );
            };

            $scope.getShippingFee = () => {
                if (
                    $scope.getTotalPrice() > 100 ||
                    $scope.getTotalPrice() == 0
                ) {
                    return 0;
                } else {
                    return 34;
                }
            };

            $scope.getTax = () => {
                return Math.floor($scope.getTotalPrice() * 0.02);
            };

            $scope.getTotalCartPrice = () => {
                return (
                    $scope.getTotalPrice() +
                    $scope.getShippingFee() +
                    $scope.getTax()
                );
            };

            $scope.increaseQuantity = (product) => {
                product = { ...product, quantity: product.quantity++ };
                cartService.setCartToLS($scope.products);
            };

            $scope.decreaseQuantity = (product) => {
                if (product.quantity === 1) {
                    $scope.setRemoveProduct(product);
                } else {
                    product = { ...product, quantity: product.quantity-- };
                }
                cartService.setCartToLS($scope.products);
            };
        },
    );
}

export default cartController;
