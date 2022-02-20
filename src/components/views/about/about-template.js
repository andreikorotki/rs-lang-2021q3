import avatar1 from '../../../../assets/images/avatar1.png';
import avatar2 from '../../../../assets/images/avatar2.png';
import avatar3 from '../../../../assets/images/avatar3.png';
import ghIcon from '../../../../assets/icons/github.svg';

export const getAboutTemplate = () => `<div class="about-wrapper">
<h2 class="about-heading">О проекте</h2>
<div class="about-project">
    Мы: Антон, Андрей и Виктор - команда js-разработчиков. В рамках курса JSCore Rolling Scopes School мы подготовили приложение для изучения английского языка в игровой форме. В учебнике собраны 3600 самых используемых в повседневной жизни слов, есть его определение и пример как на русском так и на английском!
</div>
<div class="team">
    <div class="team-member">
        <div class="member-avatar">
            <img src="${avatar2}" alt="member-image">
        </div>
        <div class="member-role">
            <h3 class="member-name">Виктор</h3>
            <h4 class="member-role-name">Разработчик</h4>
            <a href="https://github.com/VVK1978" class="gh-link"><img src="${ghIcon}" alt="gh-icon"><span>VVK1978</span></a>
            <ul class="actions">Выполнил:
                <li class="action-item">Электронный Учебник</li>
                <li class="action-item">Игра Спринт</li>
                <li class="action-item">Словарь</li>
                <li class="action-item">Redux</li>
            </ul>
        </div>
    </div>
    <div class="team-member">
        <div class="member-avatar">
            <img src="${avatar3}" alt="member-image">
        </div>
        <div class="member-role">
            <h3 class="member-name">Андрей</h3>
            <h4 class="member-role-name">Разработчик</h4>
            <a href="https://github.com/andreikorotki" class="gh-link"><img src="${ghIcon}" alt="gh-icon"><span>andreikorotki</span></a>
            <ul class="actions">Выполнил:
                <li class="action-item">Главная Cтраница</li>
                <li class="action-item">Игра Аудиовызов</li>
                <li class="action-item">Авторизация</li>
                <li class="action-item">Статистика</li>
            </ul>
        </div>
    </div>
    <div class="team-member">
        <div class="member-avatar">
            <img src="${avatar1}" alt="member-image">
        </div>
        <div class="member-role">
            <h3 class="member-name">Антон</h3>
            <h4 class="member-role-name">Разработчик</h4>
            <a href="https://github.com/Judex66" class="gh-link"><img src="${ghIcon}" alt="gh-icon"><span>Judex66</span></a>
            <ul class="actions">Выполнил:
                <li class="action-item">Тестирование приложения</li>
                <li class="action-item">Header</li>
                <li class="action-item">Участие в созвонах</li>
            </ul>
        </div>
    </div>
</div>
</div>`;
