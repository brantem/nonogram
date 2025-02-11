import { proxy } from 'valtio';
import { devtools } from 'valtio/utils';

export const data = proxy({ value: localStorage.getItem('theme') });
devtools(data, { name: 'theme' });

export function toggle() {
  switch (data.value) {
    case 'light':
      data.value = 'dark';
      localStorage.setItem('theme', 'dark');
      document.documentElement.classList.add('dark');
      break;
    case 'dark':
      data.value = 'system';
      localStorage.setItem('theme', 'system');
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      break;
    case 'system':
      data.value = 'light';
      localStorage.setItem('theme', 'light');
      document.documentElement.classList.remove('dark');
      break;
  }
}
