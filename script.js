const myInit = {
    method: 'GET',
    headers: {
        'Content-Type':'application/json'
    },
    mode: 'cors',
    cache: 'default'
};

const setRadialProgressBar = value => {
    const MAX_VALUE = 50;
    const progressBarElement = document.querySelectorAll('.current-progress');

    progressBarElement.forEach(path => {
        const length = path.getTotalLength();

        path.style.strokeDashoffset = length;
        path.style.strokeDasharray = length;

        const to = length * ((MAX_VALUE + value) / MAX_VALUE);

        path.getBoundingClientRect();
        path.style.strokeDashoffset = Math.max(0, to);
    }) ;
}

const fetchAndInsert = request => fetch(request).then(resp => resp.json()).then(data => {
    document.getElementById('current-result').innerHTML = data.current;
    document.getElementById('more-mins').innerHTML = data.more_mins;
    document.getElementById('current-streak').innerHTML = data.current_streak;
    document.getElementById('best-streak').innerHTML = data.best_streak;

    data.users.forEach(user => {
        const getClassNames = basicClass => {
            if (user.id === data.user_id) {
                return `${basicClass} ${user.status !== 'same' ? (user.status === 'rise' ? `${basicClass}--user-rise` : `${basicClass}--user-fall`) : ''}`
            }

            return `${basicClass} ${user.status !== 'same' ? (user.status === 'rise' ? `${basicClass}--rise` : `${basicClass}--fall`) : ''}`;
        };

        const newLeaderboardBoxHtml = `
            <div class="${getClassNames('leaderboard__box')}">
                <div class="${getClassNames('leaderboard__place')}">${user.place}</div>
                <div class="leaderboard__name">${user.id === data.user_id ? 'You!' : user.name}</div>
                <div class="leaderboard__current-streak">${user.current_streak}m</div>
                <div class="${getClassNames('leaderboard__status')}"></div>
            </div>
        `;

        const leaderboardRankingEle = document.querySelector('.leaderboard__ranking');
        leaderboardRankingEle.innerHTML += newLeaderboardBoxHtml;
    });

    setRadialProgressBar(data.current);
});

document.addEventListener("DOMContentLoaded", () => {
    const selectPeriodEle = document.getElementById("select-period");

    selectPeriodEle.addEventListener('change', (e) => {
        const leaderboardRankingEle = document.querySelector('.leaderboard__ranking');
        leaderboardRankingEle.innerHTML = '';

        const request = new Request(`./data/${e.target.value}.json`, myInit);
        fetchAndInsert(request);
    });

    const firstRequest = new Request(`./data/${selectPeriodEle.value}.json`, myInit);
    fetchAndInsert(firstRequest);
});