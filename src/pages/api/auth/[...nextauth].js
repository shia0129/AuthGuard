import commonApi from '@api/common/commonApi';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
  providers: [
    CredentialsProvider({
      id: 'authorization',

      async authorize(credentials, { query, headers }) {
        try {
          
          console.log("-1-- authorize ---");
          console.log(query);
          console.log("-2-- authorize ---");
          console.log(headers);
          console.log("-3-- authorize ---");
          
         
          const result = await commonApi.authenticateUser(credentials, headers);
          /*
          console.log(result);
          console.log("-4-- authorize ---");
          console.log(result.status);
          */
          console.log("-5-- authorize ---");
          console.log(result.data);
          console.log("-6-- authorize ---");
          console.log(query);
          console.log("-7-- authorize ---");
          //console.log(JSON.stringify({ status: result.status, ...result.data, ...query }));
          console.log("-8-- authorize ---");
          //{"status":200,"accessIpAddress":"192.168.1.157","firstPage":"/system/menu/menuList","accessSeq":"2024101400020000004","browserName":"Chrome","accessToken":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhY2Nlc3NJcEFkZHJlc3MiOiIxOTIuMTY4LjEuMTU3IiwiYWNjZXNzQnJvd3NlciI6IkNocm9tZSIsInVzZXJOYW1lIjoi7Ja065Oc66-8IiwidXNlclBlcm1pc3Npb25JZCI6IjIwMjMwMjI0MDAwOTAwMDAwMDEiLCJ1c2VyU2VxIjoiMjAyMzA5MTMwMDAxMDAwMDAwMSIsInN1YiI6ImFkbWluIiwiaWF0IjoxNzI4ODY5NjEwLCJleHAiOjE3MjkwODU2MTB9.gBZkX0iOBjuv-xsuq9jHaJdrdAm72MOOpbMogcX0VAU","userName":"어드민","userId":"admin","userSeq":"2023091300010000001","userPermissionId":"2023022400090000001","indexKey":"undefined","rsaKey":"-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArOQlslmye14Yr1w2EJ7PKkKG4FEzMjf8o4ZHeBZYQv/l2IHk2053op+PQhMvnI90mbJ8/ISnXiHYm1bVPO/004eddUgYYP/FZRlp/Yy6lAXOcVp2lLuCoUhQjEovN8ftifsf2m1j2uyTcDeAJkypz73eI+CUkUiV38OYuS0mw41NFL148wbdnZXo4Hlxt8DufMiuT2XzgDlH1ji1rnL4T1+mh9Q4sfbuIrM01kVf1FOWaI7+9f+XjjCl/dKRIehOG9Tv/98caUPqVshMm972xnZjk8HuuScDb7w1PR34ey6ZmqDwoS7ftw6+T2qUL2TgzuXIphMIhUFBc72S45LUlwIDAQAB\n-----END PUBLIC KEY-----"}

          return { status: result.status, ...result.data, ...query }; // 로그인 성공 시 사용자 정보.
        } catch (error) {
          throw new Error(
            JSON.stringify({ errors: error.response.data, status: error.response.status }),
          ); // 에러 발생 시 에러 정보.
        }
      },
    }),
    CredentialsProvider({
      id: 'moduleAuth',

      async authorize(credentials, dataObj) {
        try {
          return { credentials, ...dataObj.query };
        } catch (error) {
          throw new Error(
            JSON.stringify({ errors: error.response.data, status: error.response.status }),
          );
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      const { status } = user;
      const { provider } = account;

      if (provider === 'authorization' && status === 200) {
        return true;
      }
      if (provider === 'moduleAuth') {
        return true;
      }

      return false;
    },

    async jwt({ token, user, session, trigger }) {
      if (trigger === 'update') {
        if ('firstPage' in session) token.firstPage = session.firstPage;
        if ('isPasswordUpdate' in session) token.isPasswordUpdate = session.isPasswordUpdate;
      } else {
        if (user) {
          // 로그인 사용자 정보가 존재하면,
          // token 객체에 사용자 정보 담아주기.
          token.accessToken = user.accessToken;
          token.name = user.userName;
          token.userId = user.userId;
          token.firstPage = user.firstPage;
          token.rsaKey = user.rsaKey;
          token.indexKey = user.indexKey;
          token.userSeq = user.userSeq;
          token.accessSeq = user.accessSeq;
        }
      }
      return token;
    },
    async session({ session, token }) {
      // 클라이언트에서 사용할 수 있도록 session 객체에
      // jwt 설정에서 담아준 데이터 담아주기.
      session.accessToken = token.accessToken;
      session.rsaKey = token.rsaKey;
      session.indexKey = token.indexKey;
      session.user.userId = token.userId;
      session.user.firstPage = token.firstPage;
      session.user.userSeq = token.userSeq;
      session.user.accessSeq = token.accessSeq;

      if ('isPasswordUpdate' in token) session.isPasswordUpdate = token.isPasswordUpdate || false;
      console.log("-1- session --");
      console.log(session);
      console.log("-2- session --");
      return session;
    },
  },
  pages: {
    signIn: '/common/login',
    error: '/common/login',
  },
  session: {
    // 24시간
    maxAge: 24 * 60 * 60,
  },
  secret: 'hjmGWN9OF9jZec/gDo3UvpguSt6zP6nCRm6Jz2s4uhM=',
});
