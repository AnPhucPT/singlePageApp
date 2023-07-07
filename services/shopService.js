function shopService(app) {
    app.factory('shopService', function (productApi, $timeout, $rootScope) {
        const defaultParams = {
            defaultSearchParams: { page: 0, pageSize: 8 },
            defaultTagParams: {
                Category: 'All',
                From: 0,
                To: 100,
            },
        };

        const getProduct = async (searchParams) => {
            $rootScope.loading = true;
            try {
                const res = await productApi.filter(searchParams);
                const { totalPage, totalItems, datas } = res.data.data;
                const getTotalPage = () => {
                    return Array.from(
                        { length: totalPage },
                        (_, index) => index + 1,
                    );
                };

                $timeout(function () {
                    $rootScope.loading = false;
                }, 500);

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

        const getMinMax = async () => {
            $rootScope.loading = true;
            try {
                const res = await productApi.minMax();
                const { min, max } = res.data.data;

                const tagParams = {
                    ...defaultParams.defaultTagParams,
                    To: max,
                };

                $timeout(function () {
                    $rootScope.loading = false;
                }, 500);

                return { min, max, tagParams };
            } catch (error) {
                Promise.reject(error);
                $rootScope.loading = false;
            }
        };

        const getSearch = (searchParams, tagParams, search) => {
            if (search) {
                searchParams = {
                    ...searchParams,
                    page: 0,
                    keyword: search,
                };
                tagParams = { ...tagParams, Search: '" ' + search + ' "' };
            } else {
                delete searchParams.keyword;
                delete tagParams.Search;
            }

            return {
                searchParams,
                tagParams,
            };
        };

        return { defaultParams, getProduct, getMinMax, getSearch };
    });
}

export default shopService;
