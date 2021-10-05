import { fetchConToken, fetchSinToken } from '../../helpers/fetch';

describe('Pruebas en fetch helper', () => {
  let token = '';
  
  test('fetchSinToken debe de funcionar', async () => {
    const resp = await fetchSinToken('auth', { email: 'arturo@gmail.com', password: '123456' }, 'POST');

    expect(resp instanceof Response).toBeTruthy();

    const body = await resp.json();

    expect(body.ok).toBeTruthy();

    token = body.token;
  });

  test('fetchConToken debe de funcionar', async () => {
    localStorage.setItem('token', token);

    const resp = await fetchConToken('events');
    const body = await resp.json();

    expect(body).toEqual({
      ok: true,
      eventos: expect.any(Array),
    });
  });

});
