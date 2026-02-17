function googleTranslate(){
    new google.translate.TranslateElement({
        //pageLanguage: 'en',
        includedLanguages: 'en,hi,as,bn,bh,gu,ks,mr,pa,kn,ml,ta,te,or',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false,
    },'google_translate_element')
}