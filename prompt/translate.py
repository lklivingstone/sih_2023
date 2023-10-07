import argostranslate.package
import argostranslate.translate

FROM_LANG = 'en'
TO_LANG = 'hi'


def init_translator():
    """Initializes the translator by loading the required packages."""
    argostranslate.package.update_package_index()
    available_packages = argostranslate.package.get_available_packages()
    install_package = next(filter(lambda x: x.from_code == FROM_LANG and x.to_code == TO_LANG, available_packages))
    argostranslate.package.install_from_path(install_package.download())


def get_translation(message:str) -> str:
    """Returns a translated piece of text in Hindi."""
    return argostranslate.translate.translate(message,FROM_LANG, TO_LANG)


if __name__ == '__main__':
    init_translator()
    print(get_translation("Hi there, this is Rohan"))