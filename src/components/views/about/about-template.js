import avatar1 from '../../../../assets/images/avatar1.png';
import ghIcon from '../../../../assets/icons/github.svg';

export const getAboutTemplate = () => `<div class="wrapper">
<h2 class="about-heading">О проекте</h2>
<div class="about-project">
    Мы: Антон, Андрей и Виктор - команда js-разработчиков. В рамках курса JSCore Rolling Scopes School мы подготовили приложение для изучения английского языка в игровой форме.
</div>
<div class="team">
    <div class="team-memder">
        <div class="member-avatar">
            <img src="${avatar1}" alt="member-image">
        </div>
        <div class="member-role">
            <h3 class="member-name">Виктор</h3>
            <h4 class="member-role-name">Разработчик</h4>
            <a href="https://github.com/VVK1978" class="gh-link"><img src="${ghIcon}" alt="gh-icon"></a>
            <ul class="actions">
                <li class="action-item">Электронный учебник</li>
                <li class="action-item">Словарь</li>
                <li class="action-item">Игра Спринт</li>
                <li class="action-item">Redux</li>
            </ul>
        </div>
    </div>
    <div class="team-memder">
        <div class="member-avatar">
            <img src="${avatar1}" alt="member-image">
        </div>
        <div class="member-role">
            <h3 class="member-name">Андрей</h3>
            <h4 class="member-role-name">Разработчик</h4>
            <a href="https://github.com/andreikorotki" class="gh-link"><img src="${ghIcon}" alt="gh-icon"></a>
            <ul class="actions">
                <li class="action-item">Авторизация</li>
                <li class="action-item">Игра Аудиовызов</li>
                <li class="action-item">Главная страница</li>
                <li class="action-item">Статистика</li>
            </ul>
        </div>
    </div>
    <div class="team-memder">
        <div class="member-avatar">
            <img src="${avatar1}" alt="member-image">
        </div>
        <div class="member-role">
            <h3 class="member-name">Антон</h3>
            <h4 class="member-role-name">Разработчик</h4>
            <a href="https://github.com/Judex66" class="gh-link"><img src="${ghIcon}" alt="gh-icon"></a>
            <ul class="actions">
                <li class="action-item">Header</li>
                <li class="action-item">Участие в созвонах</li>
            </ul>
        </div>
    </div>
</div>
</div>`;
