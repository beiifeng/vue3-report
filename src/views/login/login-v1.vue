<template>
  <div>
    <div class="login-form">
      <a-form ref="formRef" :model="formData" :rules="rules">
        <a-form-item name="username">
          <a-input v-model:value="formData.username" placeholder="请输入用户名">
            <template #prefix>
              <user-outlined></user-outlined>
            </template>
          </a-input>
        </a-form-item>
        <a-form-item name="password">
          <a-input
            :type="showPassword ? 'text' : 'password'"
            v-model:value="formData.password"
            placeholder="请输入密码"
          >
            <template #prefix>
              <lock-outlined></lock-outlined>
            </template>
            <template #suffix>
              <component
                :is="EyeIcon"
                @click.stop="handlePasswordEye"
              ></component>
            </template>
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-checkbox v-model:checked="formData.rememberMe">
            记住密码
          </a-checkbox>
        </a-form-item>
      </a-form>
      <a-button type="primary" block @click="onSubmit" :loading="btnloading">
        登录
      </a-button>
      <div class="login-error-msg" v-if="!!errorMessage">
        <p>{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { DEFAULT_HOME_PAGE } from '@/config/globalConfig';
import { setToken } from '@/utils/auth';
import { addRememberAccount, getRememberAccount } from '@/utils/rememberMe';
import { isSuccess } from '@/utils/requestTool';
import useAuthority from '@/utils/useAuthority';
import { getPageQuery } from '@/utils/util';
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { userLogin } from './api/loginApi';

export default defineComponent({
  name: 'LoginV1',
  components: {
    UserOutlined,
    LockOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
  },
  setup() {
    const formRef = ref();
    const router = useRouter();
    const authority = useAuthority();

    const state = reactive({
      formData: {
        type: 'account',
      },
      errorMessage: '',
      btnloading: false,
      showPassword: false,
      EyeIcon: EyeOutlined,
    });

    const rules = {
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        {
          min: 1,
          max: 20,
          message: '长度在1到20之间',
          trigger: ['blur', 'change'],
        },
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        {
          min: 1,
          max: 100,
          message: '长度在1到100之间',
          trigger: ['blur', 'change'],
        },
      ],
    };

    const urlQuery = getPageQuery();

    const onSubmit = async () => {
      state.btnloading = true;
      state.errorMessage = '';
      // 验证表达输入
      try {
        await formRef.value.validate();
      } catch (err) {
        state.btnloading = false;
        return;
      }
      // 调用接口登录
      const result = await userLogin(state.formData);
      if (isSuccess(result)) {
        // 登录成功
        message.success('登录成功！');
        // 1.保存token
        setToken(result.data);
        // 2.记住密码
        addRememberAccount(state.formData.rememberMe ? state.formData : null);
        // 3.重定向
        const urlParams = new URL(window.location.href);
        let { redirect } = urlQuery;
        if (redirect) {
          try {
            const redirectUrlParams = new URL(redirect);
            // 如果url里面重定向地址与本网站同源，则进行重定向，否则跳转到默认首页
            if (redirectUrlParams.origin === urlParams.origin) {
              redirect = redirect.substr(urlParams.origin.length);
              if (redirect.match(/^\/.*#/)) {
                redirect = redirect.substr(redirect.indexOf('#') + 1);
              }
            } else {
              redirect = DEFAULT_HOME_PAGE;
            }
          } catch {
            console.log('redirect to', redirect);
          }
        }
        router.replace(redirect || DEFAULT_HOME_PAGE);
      } else {
        // 失败
        state.errorMessage = result.message;
      }
      // 登录按钮可点击
      state.btnloading = false;
    };

    onMounted(() => {
      // 1.填充密码
      Object.assign(state.formData, getRememberAccount());
      // 2.判断是否需要清除登录信息
      const { logout } = urlQuery;
      if (logout) {
        authority.clearAuthority();
        setToken('');
      }
    });

    const handlePasswordEye = () => {
      if (state.showPassword) {
        state.EyeIcon = EyeOutlined;
        state.showPassword = false;
      } else {
        state.EyeIcon = EyeInvisibleOutlined;
        state.showPassword = true;
      }
    };

    return {
      ...toRefs(state),
      formRef,
      rules,
      onSubmit,
      handlePasswordEye,
    };
  },
});
</script>
<style lang="less" scoped>
@import '../../globalVar.less';

.login-form {
  width: 25vw;
  max-width: 360px;
  min-width: 290px;
  margin: 0 5vw 0 0;
  padding: 25px 30px;
  background-color: #fff;
  border-radius: 2px;
}
.login-error-msg {
  text-align: center;
  color: @error-color;
  margin-top: @margin-lg;
  p {
    margin: 0;
  }
}
</style>
