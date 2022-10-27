const swapi = require('swapi-node');

module.exports = {
    people: async function (req, res) {
        const { sortBy } = req.body;

        const firstResult = await swapi.get(`https://swapi.dev/api/people/?page=1`);
        const pageCnt = Math.ceil(firstResult.count / 10);

        let resultArr = firstResult.results;

        const requests = [];
        for(let i = 1; i < pageCnt; i ++) {
            let pageNum = i + 1;
            const request = new Promise((resolve, reject) => {
                swapi.get(`https://swapi.dev/api/people/?page=${pageNum}`).then(result => {
                    resolve(result);
                }).catch(err => {
                    console.log(err);
                    reject();
                });
            });
            requests.push(request);
        }
        try {
            await Promise.all(requests).then(responses => {
                for(const response of responses) {
                    resultArr = resultArr.concat(response.results);
                }
            }).catch(err => {
                console.log(err);
            });

            resultArr = sortArray(resultArr, sortBy ? sortBy : 'name');

            return res.status(200).send({data: resultArr});
        } catch(err) {
            console.log(err);
            return res.status(500).send({err: err.message});
        }
    },
    planets: async function (req, res) {
        const firstResult = await swapi.get(`https://swapi.dev/api/planets/?page=1`);
        const pageCnt = Math.ceil(firstResult.count / 10);

        let resultArr = firstResult.results;

        const requests = [];
        for(let i = 1; i < pageCnt; i ++) {
            let pageNum = i + 1;
            const request = new Promise((resolve, reject) => {
                swapi.get(`https://swapi.dev/api/planets/?page=${pageNum}`).then(result => {
                    resolve(result);
                }).catch(err => {
                    console.log(err);
                    reject();
                });
            });
            requests.push(request);
        }
        try {
            await Promise.all(requests).then(responses => {
                for(const response of responses) {
                    resultArr = resultArr.concat(response.results);
                }
            }).catch(err => {
                console.log(err);
            });

            for(let i = 0; i < resultArr.length; i ++) {
                const requests = [];
                let residensUrl = resultArr[i].residents;
                let residents = [];
                for(let k = 0; k < residensUrl.length; k ++) {
                    const request = new Promise((resolve, reject) => {
                        swapi.get(`${residensUrl[k]}`).then(result => {
                            resolve(result);
                        }).catch(err => {
                            console.log(err);
                            reject();
                        });
                    });
                    requests.push(request);
                }
                await Promise.all(requests).then(responses => {
                    for(const response of responses) {
                        residents.push(response.name);
                    }
                }).catch(err => {
                    console.log(err);
                });
                resultArr[i].residents = residents;
            }

            return res.status(200).send({data: resultArr});
        } catch(err) {
            console.log(err);
            return res.status(500).send({err: err.message});
        }
    },
}

async function getNextPage(url) {
    let result = await swapi.get(url);
    return result;
}
function sortArray(arr, key) {
    arr.sort((a, b) => {
        if(a[key] > b[key]) return 1;
        else if(a[key] === b[key]) return 0;
        else return -1;
    });
    return arr;
}