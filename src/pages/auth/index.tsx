import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '@/shared/api/services/auth.service';
import s from './auth.module.scss';

type AuthMode = 'login' | 'register';

interface AuthPageProps {
  mode: AuthMode;
}

const authText = {
  login: {
    title: 'Вход',
    description: 'Войдите в аккаунт, чтобы сохранять рецепты, собирать коллекции и оставлять оценки.',
    button: 'Войти',
    switchText: 'Нет аккаунта?',
    switchLink: 'Зарегистрироваться',
    switchHref: '/register',
  },
  register: {
    title: 'Регистрация',
    description: 'Создайте профиль Cocktail Atlas, чтобы добавлять любимые коктейли и вести личные подборки.',
    button: 'Создать аккаунт',
    switchText: 'Уже есть аккаунт?',
    switchLink: 'Войти',
    switchHref: '/login',
  },
};

export const AuthPage = ({ mode }: AuthPageProps) => {
  const navigate = useNavigate();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const text = authText[mode];
  const isRegister = mode === 'register';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!login.trim() || !password.trim() || (isRegister && !displayName.trim())) {
      setError('Заполните все поля формы.');

      return;
    }

    setIsSubmitting(true);

    try {
      if (isRegister) {
        await authService.register({
          login: login.trim(),
          password,
          displayName: displayName.trim(),
        });
      } else {
        await authService.login({
          login: login.trim(),
          password,
          deviceName: 'Web',
        });
      }

      setMessage(isRegister ? 'Аккаунт создан.' : 'Вход выполнен.');
      navigate('/');
    } catch {
      setError(isRegister ? 'Не удалось создать аккаунт.' : 'Не удалось войти. Проверьте логин и пароль.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={s.page}>
      <header className={s.header}>
        <a className={s.logo} href="/">
          Cocktail Atlas
        </a>
        <nav className={s.nav} aria-label="Основная навигация">
          <a href="/">Каталог</a>
          <a href="/collections">Коллекции</a>
          <a href="/recipes/new">Публикация</a>
          <a href="/profile">Профиль</a>
        </nav>
      </header>

      <section className={s.shell}>
        <div className={s.intro}>
          <h1>{text.title}</h1>
          <p>{text.description}</p>
        </div>

        <form className={s.form} onSubmit={handleSubmit}>
          <label className={s.field}>
            <span>Логин</span>
            <input
              autoComplete="username"
              onChange={event => setLogin(event.target.value)}
              placeholder="Введите логин"
              value={login}
            />
          </label>

          {isRegister && (
            <label className={s.field}>
              <span>Имя профиля</span>
              <input
                autoComplete="name"
                onChange={event => setDisplayName(event.target.value)}
                placeholder="Как вас показывать"
                value={displayName}
              />
            </label>
          )}

          <label className={s.field}>
            <span>Пароль</span>
            <input
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              onChange={event => setPassword(event.target.value)}
              placeholder="Введите пароль"
              type="password"
              value={password}
            />
          </label>

          {error && <p className={s.error}>{error}</p>}
          {message && <p className={s.message}>{message}</p>}

          <button className={s.submitButton} disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Отправка...' : text.button}
          </button>

          <p className={s.switchText}>
            {text.switchText} <Link to={text.switchHref}>{text.switchLink}</Link>
          </p>
        </form>
      </section>
    </main>
  );
};

export const LoginPage = () => <AuthPage mode="login" />;

export const RegisterPage = () => <AuthPage mode="register" />;
