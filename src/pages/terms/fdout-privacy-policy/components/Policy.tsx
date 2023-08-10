import { Trans, useTranslation } from 'next-i18next';
import { Fragment } from 'react';
import Link from 'next/link';

export default function PolicyContent() {
  const { t } = useTranslation('policy');

  return (
    <Fragment>
      <style>
        {`
          
          h1, h2, h3{
           margin-top: 16px;
           margin-bottom: 16px;
           font-weight: bold;
           color: #0B5394;
          }
        
          a {
            color: #33a1c9;
          }
        
          p {
            margin-top: 16px;
            margin-bottom: 16px;
          }
          
          ul {
            list-style-type: disc; 
            padding: revert;
          }
          
        `}
      </style>
      <section>
        <h1 id="top">{t('title')}</h1>
        <p>{t('intro.one')}</p>
        <p>{t('intro.two')}</p>
        <p>
          <Trans
            i18nKey="intro.three"
            t={t}
            components={[
              <a
                target="_blank"
                className="text-primary-100"
                href="https://ec.europa.eu/eurostat/statistics-explained/index.php?title=Glossary:European_Economic_Area_(EEA)"
              />,
            ]}
          />
        </p>
      </section>
      <section>
        <h2>{t('intro.content.title')}</h2>
        <ul>
          <li>
            <a href="#information">{t('intro.content.glossary.information')}</a>
          </li>
          <li>
            <a href="#informationUse">{t('intro.content.glossary.information_use')}</a>
          </li>
          <li>
            <a href="#others_see">{t('intro.content.glossary.others_see')}</a>
          </li>
          <li>
            <a href="#to_others">{t('intro.content.glossary.to_others')}</a>
          </li>
          <li>
            <a href="#trans_data">{t('intro.content.glossary.trans_data')}</a>
          </li>
          <li>
            <a href="#data_storage">{t('intro.content.glossary.data_storage')}</a>
          </li>
          <li>
            <Link href="#choice">{t('intro.content.glossary.choice')}</Link>
          </li>
          <li>
            <a href="#user_rights">{t('intro.content.glossary.user_rights')}</a>
          </li>
          <li>
            <a href="#data_security">{t('intro.content.glossary.data_security')}</a>
          </li>
          <li>
            <a href="#backup">{t('intro.content.glossary.backup')}</a>
          </li>
          <li>
            <a href="#policy_change">{t('intro.content.glossary.policy_change')}</a>
          </li>
          <li>
            <a href="#contacts">{t('intro.content.glossary.contacts')}</a>
          </li>
        </ul>
      </section>
      <section>
        <h2 id="information">{t('intro.content.glossary.information')}</h2>
        <p>{t('information.one')}</p>
        <p>{t('information.two')}</p>
        <p>{t('information.three')}</p>
        <p>{t('information.four')}</p>
        <section>
          <h3>{t('information.section1.heading')}</h3>
          <ul>
            <li>
              <Trans i18nKey="information.section1.list.one.one" t={t} components={[<b />]} />
              <ul style={{ listStyleType: 'circle' }}>
                <li>{t('information.section1.list.one.list.one')}</li>
                <li>{t('information.section1.list.one.list.two')}</li>
                <li>{t('information.section1.list.one.list.three')}</li>
                <li>{t('information.section1.list.one.list.four')}</li>
                <li>{t('information.section1.list.one.list.five')}</li>
              </ul>
            </li>
            <li>
              <Trans i18nKey="information.section1.list.two" t={t} components={[<b />]} />
            </li>
            <li>
              <Trans i18nKey="information.section1.list.three" t={t} components={[<b />]} />
            </li>
          </ul>
        </section>
        <section>
          <h3>{t('information.section2.heading')}</h3>
          <ul>
            <li>
              <Trans i18nKey="information.section2.list.one" t={t} components={[<b />]} />
            </li>
            <li>
              <Trans i18nKey="information.section2.list.two" t={t} components={[<b />]} />
            </li>
          </ul>
        </section>
        <section>
          <h3>
            <Trans i18nKey="information.section3.heading" t={t} components={[<b />]} />
          </h3>
          <ul>
            <li>
              <Trans i18nKey="information.section3.list.one" t={t} components={[<b />]} />
            </li>
            <li>
              <Trans i18nKey="information.section3.list.two" t={t} components={[<b />]} />
            </li>
            <li>
              <Trans i18nKey="information.section3.list.three" t={t} components={[<b />]} />
            </li>
          </ul>
        </section>
        <section>
          <h3>{t('information.section4.heading')}</h3>
          <p>{t('information.section4.content')}</p>
        </section>
        <section>
          <h3>{t('information.section5.heading')}</h3>
          <p>{t('information.section5.content')}</p>
        </section>
        <section>
          <h3>{t('information.section6.heading')}</h3>
          <p>{t('information.section6.content')}</p>
        </section>
      </section>
      <a href="#top">{t('toTop')}</a>
      <section>
        <h2 id="informationUse">{t('intro.content.glossary.information_use')}</h2>
        <p>{t('information_use.one')}</p>
        <section>
          <h2>{t('information_use.two.heading')}</h2>
          <p>{t('information_use.two.content')}</p>
          <ul>
            <li>{t('information_use.two.list.one')}</li>
            <li>{t('information_use.two.list.two')}</li>
            <li>{t('information_use.two.list.three')}</li>
          </ul>
        </section>
        <section>
          <h3>{t('information_use.three.heading')}</h3>
          <p>{t('information_use.three.content')}</p>
          <ul>
            <li>{t('information_use.three.list.one')}</li>
            <li>{t('information_use.three.list.two')}</li>
            <li>{t('information_use.three.list.three')}</li>
            <li>{t('information_use.three.list.four')}</li>
            <li>{t('information_use.three.list.five')}</li>
            <li>{t('information_use.three.list.six')}</li>
            <li>{t('information_use.three.list.seven')}</li>
            <li>{t('information_use.three.list.eight')}</li>
            <li>{t('information_use.three.list.nine')}</li>
          </ul>
        </section>
        <section>
          <h3>{t('information_use.four.heading')}</h3>
          <p>{t('information_use.four.content')}</p>
          <ul>
            <li>{t('information_use.four.list.one')}</li>
            <li>{t('information_use.four.list.two')}</li>
            <li>{t('information_use.four.list.three')}</li>
          </ul>
        </section>
        <section>
          <h3>{t('information_use.four.heading')}</h3>
          <p>{t('information_use.four.content')}</p>
          <ul>
            <li>{t('information_use.four.list.one')}</li>
            <li>{t('information_use.four.list.two')}</li>
            <li>{t('information_use.four.list.three')}</li>
          </ul>
        </section>
        <section>
          <h3>{t('information_use.five.heading')}</h3>
          <p>{t('information_use.five.content')}</p>
          <ul>
            <li>{t('information_use.five.list.one')}</li>
            <li>{t('information_use.five.list.two')}</li>
          </ul>
        </section>
        <section>
          <h3>{t('information_use.six.heading')}</h3>
          <p>{t('information_use.six.content')}</p>
          <ul>
            <li>{t('information_use.six.list.one')}</li>
            <li>{t('information_use.six.list.two')}</li>
          </ul>
        </section>
        <section>
          <h3>{t('information_use.seven.heading')}</h3>
          <p>
            {t('information_use.seven.content')}
            <Trans i18nKey="information_use.seven.content" t={t} components={[<b style={{ color: '#0B5394' }} />]} />
          </p>
        </section>
        <section>
          <h3>{t('information_use.eight.heading')}</h3>
          <p>{t('information_use.eight.content')}</p>
        </section>
        <section>
          <h3>{t('information_use.nine.heading')}</h3>
          <p>{t('information_use.nine.content')}</p>
          <ul>
            <li>{t('information_use.nine.list.one')}</li>
            <li>{t('information_use.nine.list.two')}</li>
            <li>{t('information_use.nine.list.three')}</li>
            <li>{t('information_use.nine.list.four')}</li>
            <li>{t('information_use.nine.list.five')}</li>
          </ul>
        </section>
      </section>
      <a href="#top">{t('toTop')}</a>

      <section>
        <h2 id="others_see">{t('intro.content.glossary.others_see')}</h2>
        <p>{t('others_see.one')}</p>
        <p>{t('others_see.two.heading')}</p>
        <ul>
          <li>
            {t('others_see.two.list.one.item')}
            <ul style={{ listStyleType: 'circle' }}>
              <li>{t('others_see.two.list.one.list.one')}</li>
              <li>{t('others_see.two.list.one.list.two')}</li>
              <li>{t('others_see.two.list.one.list.three')}</li>
              <li>{t('others_see.two.list.one.list.four')}</li>
            </ul>
          </li>
          <li>
            <Trans i18nKey="others_see.two.list.two" t={t} components={[<b />, <b />]} />
          </li>
          <li>
            <Trans i18nKey="others_see.two.list.three" t={t} components={[<b />]} />
          </li>
        </ul>
      </section>
      <a href="#top">{t('toTop')}</a>

      <section>
        <h2 id="to_others">{t('intro.content.glossary.to_others')}</h2>
        <p>{t('to_others.one')}</p>
        <p>{t('to_others.two')}</p>
      </section>
      <a href="#top">{t('toTop')}</a>

      <section>
        <h2 id="trans_data">{t('intro.content.glossary.trans_data')}</h2>
        <p>{t('trans_data.one')}</p>
        <p>{t('trans_data.two')}</p>
        <p>
          <Trans i18nKey="trans_data.three" t={t} components={[<b />]} />
        </p>
      </section>
      <a href="#top">{t('toTop')}</a>

      <section>
        <h2 id="data_storage">{t('intro.content.glossary.data_storage')}</h2>
        <p>{t('data_storage.one')}</p>
        <p>{t('data_storage.two.content')}</p>
        <ul>
          <li>
            {t('data_storage.two.list.one.content')}
            <ul style={{ listStyleType: 'circle' }}>
              <li>{t('data_storage.two.list.one.list.one')}</li>
              <li>{t('data_storage.two.list.one.list.two')}</li>
              <li>{t('data_storage.two.list.one.list.three')}</li>
              <li>{t('data_storage.two.list.one.list.four')}</li>
            </ul>
          </li>
        </ul>
        <p>{t('data_storage.three')}</p>
        <p>{t('data_storage.four.one')}</p>
        <ul>
          <li>
            <Trans i18nKey="data_storage.four.list.one" t={t} components={[<b />, <b />]} />
          </li>
          <li>
            <Trans i18nKey="data_storage.four.list.two" t={t} components={[<b />, <b />]} />
          </li>
        </ul>
      </section>
      <a href="#top">{t('toTop')}</a>

      <section>
        <h2 id="choice">{t('intro.content.glossary.choice')}</h2>
        <p>{t('choice.one')}</p>
        <p>{t('choice.two.one')}</p>
        <ul>
          <li>{t('choice.two.list.one')}</li>
          <li>{t('choice.two.list.two')}</li>
          <li>{t('choice.two.list.three')}</li>
          <li>{t('choice.two.list.four')}</li>
          <li>{t('choice.two.list.five')}</li>
        </ul>
      </section>
      <a href="#top">{t('toTop')}</a>

      <section>
        <h2 id="user_rights">{t('intro.content.glossary.user_rights')}</h2>
        <p>{t('user_rights.one.one')}</p>
        <ul>
          <li>
            <Trans i18nKey="user_rights.one.list.one" t={t} components={[<b />, <b />]} />
          </li>
          <li>
            <Trans i18nKey="user_rights.one.list.two" t={t} components={[<b />, <b />]} />
          </li>
          <li>
            <Trans i18nKey="user_rights.one.list.three" t={t} components={[<b />]} />
          </li>
          <li>
            <Trans i18nKey="user_rights.one.list.four" t={t} components={[<b />]} />
          </li>
        </ul>
      </section>
      <a href="#top">{t('toTop')}</a>

      <section>
        <h2 id="data_security">{t('intro.content.glossary.data_security')}</h2>
        <p>{t('data_security')}</p>
      </section>
      <a href="#top">{t('toTop')}</a>

      <section>
        <h2 id="backup">{t('intro.content.glossary.backup')}</h2>
        <p>{t('backup.one')}</p>
        <section>
          <h3>{t('backup.two.heading')}</h3>
          <p>{t('backup.two.content')}</p>
        </section>
      </section>
      <a href="#top">{t('toTop')}</a>

      <section>
        <h2 id="policy_change">{t('intro.content.glossary.policy_change')}</h2>
        <p>{t('policy_change.one')}</p>
        <p>{t('policy_change.two')}</p>
        <p>{t('policy_change.three')}</p>
      </section>
      <a href="#top">{t('toTop')}</a>

      <section>
        <h2 id="contacts">{t('intro.content.glossary.contacts')}</h2>
        <ul>
          <li>
            <Trans i18nKey="contacts.list.one" t={t} components={[<b />]} />{' '}
            <a href={`mailto:${t('contacts.list.email')}`}>{t('contacts.list.email')}</a>
          </li>
          <li>
            <b>{t('contacts.list.two.heading')}</b>
            <address>
              <div>{t('contacts.list.two.one')}</div>
              <div>{t('contacts.list.two.two')}</div>
            </address>
          </li>
        </ul>
      </section>
      <a href="#top">{t('toTop')}</a>
    </Fragment>
  );
}
