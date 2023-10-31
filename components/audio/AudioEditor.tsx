import React, { MutableRefObject } from 'react'
import WaveSurfer from 'wavesurfer.js'
import RegionsPlugin, { Region } from 'wavesurfer.js/dist/plugins/regions'
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline'
import { Box, Card, HStack, IconButton, Tooltip } from '@chakra-ui/react'
import { TbArrowBarLeft, TbArrowBarRight, TbPlayerPause, TbPlayerPlay } from 'react-icons/tb'

const reducer = (prevState: any, action: any) => {
	switch (action.type) {
		case 'play':
			return {
				...prevState,
				playing: true,
			}
		case 'pause':
		case 'finish':
			return {
				...prevState,
				playing: false,
			}
	}

	return prevState
}

export const AudioEditor: React.FC<{ src: string; valueRef: React.MutableRefObject<{ start: number; end: number }> }> = ({ src, valueRef }) => {
	const [container, setContainer] = React.useState<HTMLDivElement | null>(null)
	const [state, dispatch] = React.useReducer(reducer, () => ({ playing: false }))
	const wsRef = React.useRef<WaveSurfer | null>(null)
	const regionRef = React.useRef<Region | null>(null)

	React.useEffect(() => {
		if (container) {
			const regions = RegionsPlugin.create()

			const wavesurfer = new WaveSurfer({
				container,
				waveColor: '#4F4A85',
				progressColor: '#383351',
				url: src,
				backend: 'MediaElement',
				plugins: [regions, TimelinePlugin.create()],
			})

			wavesurfer.on('decode', () => {
				const reg = (regionRef.current = regions.addRegion({
					start: 0,
					end: wavesurfer.getDuration(),
					color: 'rgba(0, 0, 255, 0.2)',
					resize: true,
					drag: true,
				}))
				valueRef.current = { start: reg.start, end: reg.end }
			})

			regions.on('region-out', () => {
				if (!wsRef.current!.isPlaying()) return
				const reg = regionRef.current!
				wavesurfer.stop()
				wavesurfer.setTime(reg.start)
			})

			regions.on('region-updated', (reg) => {
				valueRef.current = { start: reg.start, end: reg.end }
			})

			wavesurfer.on('play', () => dispatch({ type: 'play' }))
			wavesurfer.on('pause', () => dispatch({ type: 'pause' }))
			wavesurfer.on('finish', () => dispatch({ type: 'finish' }))

			wsRef.current = wavesurfer

			return () => wavesurfer.destroy()
		}
	}, [container, src])

	return (
		<Card p={4}>
			<Box ref={(instance) => setContainer(instance)} />
			<HStack mt={2}>
				{state.playing ? (
					<Tooltip label="일시정지">
						<IconButton aria-label="일시정지" onClick={() => wsRef.current?.pause()}>
							<TbPlayerPause />
						</IconButton>
					</Tooltip>
				) : (
					<Tooltip label="재생">
						<IconButton
							aria-label="재생"
							onClick={() => {
								const reg = regionRef.current!
								const ws = wsRef.current!
								const time = ws.getCurrentTime()

								if (time >= reg.start && time <= reg.end) {
									ws.play()
									return
								}

								reg.play()
							}}
						>
							<TbPlayerPlay />
						</IconButton>
					</Tooltip>
				)}
				<Tooltip label="여기를 시작 지점으로 설정">
					<IconButton
						aria-label="여기를 시작 지점으로 설정"
						onClick={() => {
							const reg = regionRef.current
							const ws = wsRef.current
							if (!reg || !ws) return
							reg.setOptions({
								start: ws.getCurrentTime(),
								end: reg.end,
							})
							valueRef.current = { start: reg.start, end: reg.end }
						}}
					>
						<TbArrowBarRight />
					</IconButton>
				</Tooltip>
				<Tooltip label="여기를 끝 지점으로 설정">
					<IconButton
						aria-label="여기를 끝 지점으로 설정"
						onClick={() => {
							const reg = regionRef.current
							const ws = wsRef.current
							if (!reg || !ws) return
							reg.setOptions({
								start: reg.start,
								end: ws.getCurrentTime(),
							})
							valueRef.current = { start: reg.start, end: reg.end }
						}}
					>
						<TbArrowBarLeft />
					</IconButton>
				</Tooltip>
			</HStack>
		</Card>
	)
}
