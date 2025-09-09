import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import {
  GoogleLoginProvider,
  SocialLoginModule,
  FacebookLoginProvider,
  SocialAuthServiceConfig,
} from '@abacritt/angularx-social-login';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(FormsModule),
    importProvidersFrom(
      SocialLoginModule.initialize({
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('304753457158-e6gg6gn4c5kua773fihgm4ad7a8v256v.apps.googleusercontent.com'),
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('EAALLDba4OyQBPT3UKj3ZARZCYzw8S4Ara2SlV6CORl3YBBYuFjsMGCoZBHV8ZAT3JBzLDcaBoUfkqw0ZCt8H607YdSMBCYzUoMGZAG5ZANDor4ikGZBkPAYe2VShZBMtSUEeGxJdeDLz7MdGlHuja6vN3riI89DM1x94I3S4FBpNAOAMb2aUtm8NOHp7ikqwSx98WGAfaaJCy4bPhy4VVs2ZAouan0pbK8nvB6PeLMeEW2al2qHp5DWgcFQeYe6DxuknVlSxgTXHqT9T8s4QZDZD'),
          },
        ],
      })
    )
  ],
};
