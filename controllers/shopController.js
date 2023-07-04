function shopController(app) {
    const initialPagination = { page: 0, pageSize: 8 };
    const priceGap = 20;

    app.controller(
        'shopController',
        function ($scope, $http, $timeout, $rootScope, cartService) {
            $scope.searchParams = { ...initialPagination };
            $scope.search = '';

            $scope.resetProduct = () => {
                $scope.searchParams = { ...initialPagination };
                $scope.search = '';
            };

            $scope.getAllProduct = () => {
                $rootScope.loading = true;
                $http
                    .get('http://localhost:8080/api/public/products/filter', {
                        params: $scope.searchParams,
                    })
                    .then((res) => {
                        $scope.products = res.data.data.datas;
                        $scope.totalPage = res.data.data.totalPage;
                        $scope.totalItems = res.data.data.totalItems;
                        $scope.getTotalPage = () => {
                            return Array.from(
                                { length: $scope.totalPage },
                                (_, index) => index + 1,
                            );
                        };
                    })
                    .catch((err) => {
                        Promise.reject(err);
                    })
                    .finally(() => {
                        $timeout(function () {
                            $rootScope.loading = false;
                        }, 300);
                    });
            };

            $scope.$watch('searchParams', function () {
                $scope.getAllProduct();
            });

            $scope.$watch('search', function () {
                if ($scope.search) {
                    $scope.searchParams = {
                        ...$scope.searchParams,
                        page: 0,
                        pageSize: $scope.searchParams.pageSize,
                        keyword: $scope.search,
                    };
                } else {
                    if ($scope.searchParams.keyword) {
                        delete $scope.searchParams.keyword;
                        $scope.searchParams = { ...$scope.searchParams };
                    }
                }
            });

            $scope.$watch('max', function () {
                if ($scope.max - $scope.min < priceGap) {
                    $scope.max = $scope.min + priceGap;
                }
                $scope.RightValue =
                    100 - ($scope.max / $scope.maxValue) * 100 + '%';
            });

            $scope.$watch('min', function () {
                if ($scope.max - $scope.min < priceGap) {
                    $scope.min = $scope.max - priceGap;
                }
                $scope.LeftValue = ($scope.min / $scope.maxValue) * 100 + '%';
            });

            $scope.nextPage = () => {
                if ($scope.searchParams.page < $scope.totalPage - 1) {
                    $scope.searchParams = {
                        ...$scope.searchParams,
                        page: ($scope.searchParams.page += 1),
                    };
                }
            };
            $scope.prevPage = () => {
                if ($scope.searchParams.page > 0) {
                    $scope.searchParams = {
                        ...$scope.searchParams,
                        page: ($scope.searchParams.page -= 1),
                    };
                }
            };

            $scope.changePage = (index) => {
                $scope.searchParams = {
                    ...$scope.searchParams,
                    page: index - 1,
                };
            };

            $scope.getProductByCategory_Id = (id) => {
                $scope.searchParams = {
                    ...$scope.searchParams,
                    categoryId: id,
                };
            };

            $scope.getProductByPriceRange = () => {
                $scope.searchParams = {
                    ...$scope.searchParams,
                    minPrice: $scope.min,
                    maxPrice: $scope.max,
                };
            };

            $scope.getMinMax = () => {
                $http
                    .get('http://localhost:8080/api/public/product/min-max')
                    .then((res) => {
                        $scope.minValue = 0;
                        $scope.maxValue = res.data.data.max + 30;
                        $scope.min = res.data.data.min;
                        $scope.max = res.data.data.max;
                        $scope.LeftValue =
                            ($scope.min / $scope.maxValue) * 100 + '%';
                        $scope.RightValue =
                            100 - ($scope.max / $scope.maxValue) * 100 + '%';
                    });
            };

            $scope.getMinMax();

            $scope.addToCart = (product) => {
                $rootScope.loading = true;
                cartService.addToCart(product);
                $rootScope.carts = cartService.getCartFromLS();
                $timeout(function () {
                    $rootScope.loading = false;
                }, 500);
                $timeout(function () {
                    showSuccessToast();
                }, 700);
            };
        },
    );
}

export default shopController;
