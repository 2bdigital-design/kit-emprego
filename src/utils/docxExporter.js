import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, Table, TableRow, TableCell, WidthType } from 'docx'

function baixarBlob(blob, nomeArquivo) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = nomeArquivo
  a.click()
  URL.revokeObjectURL(url)
}

function paragrafosTexto(texto) {
  return (texto || '').split('\n').filter(p => p.trim()).map(p =>
    new Paragraph({
      children: [new TextRun({ text: p, size: 22 })],
      spacing: { after: 160 }
    })
  )
}

export async function gerarDocxKit({ pessoal, vaga, resultado, selecao, nomeSlug, cargoSlug, empresaSlug }) {
  const hoje = new Date().toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' })

  const seccoesCV = [
    new Paragraph({
      children: [new TextRun({ text: pessoal.nome || 'Nome Completo', bold: true, size: 44 })],
      spacing: { after: 80 }
    }),
    new Paragraph({
      children: [new TextRun({ text: pessoal.titulo || '', size: 26, color: '6B7280' })],
      spacing: { after: 80 }
    }),
    new Paragraph({
      children: [new TextRun({
        text: [pessoal.email, pessoal.telefone, pessoal.localizacao, pessoal.linkedin].filter(Boolean).join(' | '),
        size: 20, color: '9CA3AF'
      })],
      spacing: { after: 320 }
    }),

    ...(resultado.resumoProfissional ? [
      new Paragraph({
        children: [new TextRun({ text: 'RESUMO PROFISSIONAL', bold: true, size: 22, allCaps: true })],
        border: { bottom: { color: 'E2E8F0', style: BorderStyle.SINGLE, size: 6 } },
        spacing: { after: 120 }
      }),
      new Paragraph({
        children: [new TextRun({ text: resultado.resumoProfissional, size: 22 })],
        spacing: { after: 320 }
      })
    ] : []),

    ...(resultado.experienciasOtimizadas?.length ? [
      new Paragraph({
        children: [new TextRun({ text: 'EXPERIÊNCIA PROFISSIONAL', bold: true, size: 22, allCaps: true })],
        border: { bottom: { color: 'E2E8F0', style: BorderStyle.SINGLE, size: 6 } },
        spacing: { after: 160 }
      }),
      ...resultado.experienciasOtimizadas.flatMap(exp => [
        new Paragraph({
          children: [
            new TextRun({ text: exp.cargo, bold: true, size: 24 }),
            new TextRun({ text: `  ·  ${exp.empresa}`, size: 22, color: '6B7280' }),
            new TextRun({ text: `     ${exp.periodo}`, size: 20, color: '9CA3AF' })
          ],
          spacing: { after: 80 }
        }),
        ...(exp.bullets || []).map(b =>
          new Paragraph({
            children: [new TextRun({ text: `▸ ${b}`, size: 21, color: '374151' })],
            spacing: { after: 60 },
            indent: { left: 360 }
          })
        ),
        new Paragraph({ spacing: { after: 160 } })
      ])
    ] : []),

    ...(resultado.competenciasOrdenadas?.length ? [
      new Paragraph({
        children: [new TextRun({ text: 'COMPETÊNCIAS', bold: true, size: 22, allCaps: true })],
        border: { bottom: { color: 'E2E8F0', style: BorderStyle.SINGLE, size: 6 } },
        spacing: { after: 120 }
      }),
      new Paragraph({
        children: [new TextRun({ text: resultado.competenciasOrdenadas.join(' · '), size: 22 })],
        spacing: { after: 320 }
      })
    ] : [])
  ]

  const seccoesCarta = [
    new Paragraph({
      children: [new TextRun({ text: pessoal.nome || '', bold: true, size: 40 })],
      spacing: { after: 80 }
    }),
    new Paragraph({
      children: [new TextRun({ text: pessoal.titulo || '', size: 24, color: '6B7280' })],
      spacing: { after: 80 }
    }),
    new Paragraph({
      children: [new TextRun({
        text: [pessoal.email, pessoal.telefone, pessoal.localizacao].filter(Boolean).join(' | '),
        size: 20, color: '9CA3AF'
      })],
      spacing: { after: 400 }
    }),
    new Paragraph({
      children: [new TextRun({ text: `${pessoal.localizacao}, ${hoje}`, size: 20, color: '9CA3AF' })],
      spacing: { after: 200 }
    }),
    new Paragraph({
      children: [new TextRun({ text: `Exmo(a). Sr(a). Responsável de Recrutamento,`, bold: true, size: 22 })],
      spacing: { after: 80 }
    }),
    new Paragraph({
      children: [new TextRun({ text: vaga.empresa || '', size: 22, color: '6B7280' })],
      spacing: { after: 240 }
    }),
    ...paragrafosTexto(resultado.cartaApresentacao),
    new Paragraph({ spacing: { after: 240 } }),
    new Paragraph({
      children: [new TextRun({ text: 'Com os melhores cumprimentos,', size: 22 })],
      spacing: { after: 200 }
    }),
    new Paragraph({
      children: [new TextRun({ text: pessoal.nome || '', bold: true, size: 26 })],
      spacing: { after: 40 }
    }),
    new Paragraph({
      children: [new TextRun({ text: pessoal.titulo || '', size: 22, color: '6B7280' })]
    })
  ]

  if (selecao === 'cv') {
    const doc = new Document({ sections: [{ properties: {}, children: seccoesCV }] })
    const blob = await Packer.toBlob(doc)
    baixarBlob(blob, `CV_${nomeSlug}.docx`)
    return
  }

  if (selecao === 'carta') {
    const doc = new Document({ sections: [{ properties: {}, children: seccoesCarta }] })
    const blob = await Packer.toBlob(doc)
    baixarBlob(blob, `Carta_${nomeSlug}_${empresaSlug}.docx`)
    return
  }

  // Kit completo — dois documentos separados
  const docCv = new Document({ sections: [{ properties: {}, children: seccoesCV }] })
  const docCarta = new Document({ sections: [{ properties: {}, children: seccoesCarta }] })
  const blobCv = await Packer.toBlob(docCv)
  const blobCarta = await Packer.toBlob(docCarta)
  baixarBlob(blobCv, `CV_${nomeSlug}.docx`)
  setTimeout(() => baixarBlob(blobCarta, `Carta_${nomeSlug}_${empresaSlug}.docx`), 300)
}
