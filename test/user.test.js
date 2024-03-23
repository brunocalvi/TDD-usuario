const app = require("../src/app");
const supertest = require("supertest");

let request = supertest(app);

let mainUser = {name: "King Sais", email: "king.sais@node.com", password: "123456"}

beforeAll(() => {
  return request.post("/user")
  .send(mainUser).then(res => {

  }).catch(e => {
    console.log(e);
  });
});

afterAll(() => {
  return request.delete(`/user/${mainUser.email}`)
  .then(res => {})
  .catch(e => { console.log(e) })
});

describe("Cadastro de usuário", () => {
  test("Deve cadastrar um usuário com sucesso", () => {
    let time = Date.now();
    let email = `${time}@node.com`;

    let user = {
      name: "Victor",
      email: email,
      password: "123456",
    };

    return request.post("/user")
    .send(user).then(res => {
      expect(res.statusCode).toEqual(200);
      expect(res.body.email).toEqual(email);

    }).catch(e => {
      expect(e).toMatch(e);
    })
  });

  test("Deve impedir que o usuário se cadastra com dados vazios", () => {
    let user = {name: "", email: "", password: ""};

    return request.post("/user")
    .send(user).then(res => {
      expect(res.statusCode).toEqual(400);

    }).catch(e => {
      expect(e).toMatch(e);
    })
  });

  test("Deve impedir que um usuário se cadastre com e-mail repetido", () => {
    let time = Date.now();
    let email = `${time}@node.com`;

    let user = { name: "Victor", email: email, password: "123456" };

    return request.post("/user")
    .send(user).then(res => {
      expect(res.statusCode).toEqual(200);
      expect(res.body.email).toEqual(email);

      return request.post("/user")
      .send(user).then(res => {
        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toEqual("E-mail já cadastrado.");

      }).catch(e => {
        expect(e).toMatch(e);
      });

    }).catch(e => {
      expect(e).toMatch(e);
    })
  });
});

describe("Autenticação", () => {
  test("Deve retornar um token quando logar", () => {
    return request.post("/auth")
    .send({email: mainUser.email, password: mainUser.password})
    .then(res => {
      expect(res.statusCode).toEqual(200);
      expect(res.body.token).toBeDefined();

    }).catch(e => {
      expect(e).toMatch(e);
    });
  })

  test("Deve impedir que um usuário não cadastrado se logue", () => {
    return request.post("/auth")
    .send({email: "mail@mail.com.br", password: "teste"})
    .then(res => {
      expect(res.statusCode).toEqual(403);
      expect(res.body.errors.email).toEqual("E-mail não cadastrado.");

    }).catch(e => {
      expect(e).toMatch(e);
    });
  });

  test("Deve impedir que um usuário se logue com uma senha errada", () => {
    return request.post("/auth")
    .send({email: mainUser.email, password: "teste"})
    .then(res => {
      expect(res.statusCode).toEqual(403);
      expect(res.body.errors.password).toEqual("Senha incorreta.");

    }).catch(e => {
      expect(e).toMatch(e);
    });
  });
});