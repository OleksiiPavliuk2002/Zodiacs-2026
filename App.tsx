import React, { useState } from 'react';
import SplashScreen             from './src/screens/SplashScreen';
import ZodiacPickerScreen       from './src/screens/ZodiacPickerScreen';
import HoroscopeScreen          from './src/screens/HoroscopeScreen';
import CompatibilityScreen      from './src/screens/CompatibilityScreen';
import CompatibilityResultScreen from './src/screens/CompatibilityResultScreen';

type Screen =
  | 'splash'
  | 'zodiac-picker'
  | 'horoscope'
  | 'compatibility'
  | 'compatibility-result';

export default function App() {
  const [screen, setScreen]           = useState<Screen>('splash');
  const [mySign, setMySign]           = useState<string>('libra');
  const [partnerSign, setPartnerSign] = useState<string>('scorpio');

  switch (screen) {
    case 'splash':
      return <SplashScreen onFinish={() => setScreen('zodiac-picker')} />;

    case 'zodiac-picker':
      return (
        <ZodiacPickerScreen
          onContinue={signId => { setMySign(signId); setScreen('horoscope'); }}
        />
      );

    case 'horoscope':
      return (
        <HoroscopeScreen
          signId={mySign}
          onBack={() => setScreen('zodiac-picker')}
          onTabChange={tab => { if (tab === 'compatibility') setScreen('compatibility'); }}
        />
      );

    case 'compatibility':
      return (
        <CompatibilityScreen
          mySignId={mySign}
          onBack={() => setScreen('zodiac-picker')}
          onContinue={partnerId => { setPartnerSign(partnerId); setScreen('compatibility-result'); }}
        />
      );

    case 'compatibility-result':
      return (
        <CompatibilityResultScreen
          mySignId={mySign}
          partnerSignId={partnerSign}
          onBack={() => setScreen('zodiac-picker')}
          onTabChange={tab => {
            if (tab === 'horoscope') setScreen('horoscope');
          }}
        />
      );

    default:
      return null;
  }
}
