function shopService(app) {
    app.factory('shopService', function (productApi, $timeout, $rootScope) {
        const defaultParams = {
            d_searchPrs: { page: 0, pageSize: 8 },
            d_tagPrs: {
                Category: 'All',
                From: 0,
                To: 100,
            },
        };
        const getProduct = async (searchParams) => {
            $rootScope.loading = true;
            try {
                const res = await productApi.filter(searchParams);
                $timeout(function () {
                    $rootScope.loading = false;
                }, 500);
                const { totalPage, totalItems, datas } = res.data.data;
                const getTotalPage = () => {
                    return Array.from(
                        { length: totalPage },
                        (_, index) => index + 1,
                    );
                };
                return {
                    getTotalPage,
                    totalPage,
                    totalItems,
                    datas,
                };
            } catch (error) {
                Promise.reject(error);
                $rootScope.loading = false;
            }
        };
        return { defaultParams, getProduct };
    });
}

export default shopService;
