import { useTranslation } from 'next-i18next';
import { Fragment } from 'react';

export default function PublicOfferContent() {
  const { t } = useTranslation('publicoffer');

  return (
    <Fragment>
      <style>
        {`
          ul, ol {
            padding: 0 0 0 15px !important;
            margin: 0;
          }
          .arabic {
            list-style-type: arabic;
          }
          .disc {
            list-style-type: disc;
          }
          .circle {
            list-style-type: circle;
          }
        `}
      </style>
      <h2>{t('heading')}</h2>
      <p>{t('edition')}</p>
      <ol className="arabic">
        <li>
          {t('list.item1.heading')}
          <ul className="circle">
            <li>{t('list.item1.list.i1')}</li>
            <li>{t('list.item1.list.i2')}</li>
            <li>{t('list.item1.list.i3')}</li>
            <li>{t('list.item1.list.i4')}</li>
            <li>
              {t('list.item1.list.i5.heading')}
              <ul className="disc">
                <li>{t('list.item1.list.i5.list.i1')}</li>
                <li>{t('list.item1.list.i5.list.i2')}</li>
                <li>{t('list.item1.list.i5.list.i3')}</li>
                <li>{t('list.item1.list.i5.list.i4')}</li>
                <li>{t('list.item1.list.i5.list.i5')}</li>
                <li>{t('list.item1.list.i5.list.i6')}</li>
                <li>{t('list.item1.list.i5.list.i7')}</li>
                <li>{t('list.item1.list.i5.list.i8')}</li>
                <li>{t('list.item1.list.i5.list.i9')}</li>
                <li>{t('list.item1.list.i5.list.i10')}</li>
                <li>{t('list.item1.list.i5.list.i11')}</li>
                <li>{t('list.item1.list.i5.list.i12')}</li>
                <li>{t('list.item1.list.i5.list.i13')}</li>
                <li>{t('list.item1.list.i5.list.i14')}</li>
                <li>{t('list.item1.list.i5.list.i15')}</li>
                <li>{t('list.item1.list.i5.list.i17')}</li>
                <li>{t('list.item1.list.i5.list.i18')}</li>
                <li>{t('list.item1.list.i5.list.i19')}</li>
                <li>{t('list.item1.list.i5.list.i20')}</li>
                <li>{t('list.item1.list.i5.list.i21')}</li>
              </ul>
            </li>
          </ul>
        </li>
        <li>
          {t('list.item2.heading')}
          <ul className="circle">
            <li>{t('list.item2.list.i1')}</li>
            <li>{t('list.item2.list.i2')}</li>
            <li>{t('list.item2.list.i3')}</li>
            <li>{t('list.item2.list.i4')}</li>
            <li>{t('list.item2.list.i5')}</li>
            <li>{t('list.item2.list.i6')}</li>
            <li>{t('list.item2.list.i7')}</li>
            <li>{t('list.item2.list.i8')}</li>
          </ul>
        </li>
        <li>
          {t('list.item3.heading')}
          <ul className="arabic">
            <li>{t('list.item3.list.i1')}</li>
            <li>{t('list.item3.list.i2')}</li>
            <li>{t('list.item3.list.i3')}</li>
            <li>{t('list.item3.list.i4')}</li>
            <li>{t('list.item3.list.i5')}</li>
            <li>{t('list.item3.list.i6')}</li>
            <li>{t('list.item3.list.i7')}</li>
            <li>{t('list.item3.list.i8')}</li>
            <li>{t('list.item3.list.i9')}</li>
            <li>{t('list.item3.list.i10')}</li>
            <li>{t('list.item3.list.i11')}</li>
            <li>
              {t('list.item3.list.i12.heading')}
              <ul className="disc">
                <li>{t('list.item3.list.i12.list.i1')}</li>
                <li>{t('list.item3.list.i12.list.i2')}</li>
                <li>{t('list.item3.list.i12.list.i3')}</li>
                <li>{t('list.item3.list.i12.list.i4')}</li>
                <li>{t('list.item3.list.i12.list.i5')}</li>
                <li>{t('list.item3.list.i12.list.i6')}</li>
                <li>{t('list.item3.list.i12.list.i7')}</li>
              </ul>
            </li>
            <li>
              {t('list.item3.list.i13.heading')}
              <ul className="disc">
                <li>{t('list.item3.list.i13.list.i1')}</li>
                <li>{t('list.item3.list.i13.list.i2')}</li>
                <li>{t('list.item3.list.i13.list.i3')}</li>
                <li>{t('list.item3.list.i13.list.i4')}</li>
                <li>{t('list.item3.list.i13.list.i5')}</li>
              </ul>
            </li>
          </ul>
        </li>
        <li>
          {t('list.item4.heading')}
          <ul className="arabic">
            <li>{t('list.item4.list.i1')}</li>
            <li>{t('list.item4.list.i2')}</li>
            <li>{t('list.item4.list.i3')}</li>
            <li>{t('list.item4.list.i4')}</li>
            <li>{t('list.item4.list.i5')}</li>
            <li>{t('list.item4.list.i6')}</li>
            <li>{t('list.item4.list.i7')}</li>
            <li>{t('list.item4.list.i8')}</li>
            <li>{t('list.item4.list.i9')}</li>
          </ul>
        </li>
        <li>
          {t('list.item5.heading')}
          <ul className="arabic">
            <li>{t('list.item5.list.i1')}</li>
            <li>{t('list.item5.list.i2')}</li>
            <li>{t('list.item5.list.i3')}</li>
            <li>{t('list.item5.list.i4')}</li>
            <li>{t('list.item5.list.i5')}</li>
            <li>{t('list.item5.list.i6')}</li>
            <li>{t('list.item5.list.i7')}</li>
            <li>{t('list.item5.list.i8')}</li>
            <li>
              {t('list.item5.list.i9.heading')}
              <ul className="disc">
                <li>{t('list.item5.list.i9.list.i1')}</li>
                <li>{t('list.item5.list.i9.list.i2')}</li>
                <li>{t('list.item5.list.i9.list.i3')}</li>
                <li>{t('list.item5.list.i9.list.i4')}</li>
                <li>{t('list.item5.list.i9.list.i5')}</li>
              </ul>
            </li>
            <li>
              {t('list.item5.list.i10.heading')}
              <ul className="disc">
                <li>{t('list.item5.list.i10.list.i1')}</li>
                <li>{t('list.item5.list.i10.list.i2')}</li>
                <li>{t('list.item5.list.i10.list.i3')}</li>
                <li>{t('list.item5.list.i10.list.i4')}</li>
                <li>{t('list.item5.list.i10.list.i5')}</li>
                <li>{t('list.item5.list.i10.list.i6')}</li>
                <li>{t('list.item5.list.i10.list.i7')}</li>
                <li>{t('list.item5.list.i10.list.i8')}</li>
              </ul>
            </li>
            <li>
              {t('list.item5.list.i11.heading')}
              <ul className="disc">
                <li>{t('list.item5.list.i11.list.i1')}</li>
                <li>{t('list.item5.list.i11.list.i2')}</li>
                <li>{t('list.item5.list.i11.list.i3')}</li>
                <li>{t('list.item5.list.i11.list.i4')}</li>
                <li>{t('list.item5.list.i11.list.i5')}</li>
                <li>{t('list.item5.list.i11.list.i6')}</li>
              </ul>
            </li>
            <li>
              {t('list.item5.list.i12.heading')}
              <ul className="disc">
                <li>{t('list.item5.list.i12.list.i1')}</li>
                <li>{t('list.item5.list.i12.list.i2')}</li>
                <li>{t('list.item5.list.i12.list.i3')}</li>
                <li>{t('list.item5.list.i12.list.i4')}</li>
                <li>{t('list.item5.list.i12.list.i5')}</li>
                <li>{t('list.item5.list.i12.list.i6')}</li>
              </ul>
            </li>
            <li>{t('list.item5.list.i13')}</li>
            <li>
              {t('list.item5.list.i14.heading')}
              <ul className="disc">
                <li>{t('list.item5.list.i14.list.i1')}</li>
                <li>{t('list.item5.list.i14.list.i2')}</li>
              </ul>
            </li>
            <li>{t('list.item5.list.i15')}</li>
          </ul>
        </li>
        <li>
          {t('list.item6.heading')}
          <ul className="arabic">
            <li>{t('list.item6.list.i1')}</li>
            <li>{t('list.item6.list.i2')}</li>
            <li>{t('list.item6.list.i3')}</li>
            <li>{t('list.item6.list.i4')}</li>
            <li>{t('list.item6.list.i5')}</li>
            <li>{t('list.item6.list.i6')}</li>
            <li>
              {t('list.item6.list.i7.heading')}
              <ul className="disc">
                <li>{t('list.item6.list.i7.list.i1')}</li>
                <li>{t('list.item6.list.i7.list.i2')}</li>
                <li>{t('list.item6.list.i7.list.i3')}</li>
                <li>{t('list.item6.list.i7.list.i4')}</li>
                <li>{t('list.item6.list.i7.list.i5')}</li>
              </ul>
            </li>
            <li>{t('list.item6.list.i8')}</li>
            <li>{t('list.item6.list.i9')}</li>
            <li>{t('list.item6.list.i10')}</li>
            <li>
              {t('list.item6.list.i11.heading')}
              <ul className="disc">
                <li>{t('list.item6.list.i11.list.i1')}</li>
                <li>{t('list.item6.list.i11.list.i2')}</li>
                <li>{t('list.item6.list.i11.list.i3')}</li>
                <li>{t('list.item6.list.i11.list.i4')}</li>
              </ul>
            </li>
          </ul>
        </li>
        <li>
          {t('list.item7.heading')}
          <ul className="arabic">
            <li>{t('list.item7.list.i1')}</li>
          </ul>
        </li>
        <li>
          {t('list.item8.heading')}
          <ul className="circle">
            <li>{t('list.item8.list.i1')}</li>
            <li>{t('list.item8.list.i2')}</li>
            <li>{t('list.item8.list.i3')}</li>
            <li>{t('list.item8.list.i4')}</li>
          </ul>
        </li>
        <li>
          {t('list.item9.heading')}
          <ul className="arabic">
            <li>{t('list.item9.list.i1')}</li>
            <li>{t('list.item9.list.i2')}</li>
            <li>{t('list.item9.list.i3')}</li>
          </ul>
        </li>
        <li>
          {t('list.item10.heading')}
          <ul className="arabic">
            <li>{t('list.item10.list.i1')}</li>
            <li>{t('list.item10.list.i2')}</li>
            <li>{t('list.item10.list.i3')}</li>
          </ul>
        </li>
        <li>
          {t('list.item11.heading')}
          <ul className="arabic">
            <li>{t('list.item11.list.i1')}</li>
            <li>{t('list.item11.list.i2')}</li>
            <li>{t('list.item11.list.i3')}</li>
            <li>
              {t('list.item11.list.i4.heading')}
              <ul className="disc">
                <li>{t('list.item11.list.i4.list.i1')}</li>
              </ul>
            </li>
          </ul>
        </li>
      </ol>
    </Fragment>
  );
}
