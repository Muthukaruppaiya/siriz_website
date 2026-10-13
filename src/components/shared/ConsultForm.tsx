import { useState, type FormEvent } from 'react'
import { propertyTypes, whatsappUrl } from '../../data/contact'
import { Button } from './Button'
import styles from './ConsultForm.module.css'

type Props = {
  tone?: 'light' | 'dark'
}

export function ConsultForm({ tone = 'dark' }: Props) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [property, setProperty] = useState<string>('')
  const [message, setMessage] = useState('')

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const lines = [
      'Hi Siriz Interiors, I would like to book a free design consultation.',
      name && `Name: ${name}`,
      phone && `Phone: ${phone}`,
      property && `Property: ${property}`,
      message && `Details: ${message}`,
    ].filter(Boolean)
    window.open(whatsappUrl(lines.join('\n')), '_blank', 'noopener,noreferrer')
  }

  return (
    <form className={`${styles.form} ${styles[tone]}`} onSubmit={onSubmit}>
      <div className={styles.row}>
        <label className={styles.field}>
          <span>Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            autoComplete="name"
            required
          />
        </label>
        <label className={styles.field}>
          <span>Phone</span>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91"
            autoComplete="tel"
            inputMode="tel"
          />
        </label>
      </div>

      <fieldset className={styles.chips}>
        <legend>Property type</legend>
        {propertyTypes.map((type) => (
          <label
            key={type}
            className={`${styles.chip} ${property === type ? styles.chipActive : ''}`}
          >
            <input
              type="radio"
              name="property"
              value={type}
              checked={property === type}
              onChange={() => setProperty(type)}
            />
            {type}
          </label>
        ))}
      </fieldset>

      <label className={styles.field}>
        <span>Tell us about your home</span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Rooms, timeline, budget, or anything you have in mind"
          rows={4}
        />
      </label>

      <Button type="submit" variant={tone === 'dark' ? 'primary' : 'dark'}>
        Book free consultation on WhatsApp
      </Button>
      <p className={styles.note}>Opens WhatsApp with your details filled in.</p>
    </form>
  )
}
