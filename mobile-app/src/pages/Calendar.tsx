import { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { MarkedDates } from 'react-native-calendars/src/types';
import { getMenstrualCycleDates } from '../api/menstrualCycle';
// import { MenstrualCycleDates } from '../api/response/MenstrualCycleDates';
// import OptionList from '../components/OptionList';

const screen = Dimensions.get( 'window' );

const CalendarScreen = () => 
{
	const [pressed, setPressed] = useState( false );
	const [dayPressed, setDayPressed] = useState<DateData>();
	const [markedDatesArray, setMarkedDatesArray] = useState<MarkedDates>();

	useEffect( () => 
	{
		( async () => 
		{
			getDateSettings();
		} )();
	}, [] );

	async function getDateSettings() 
	{
		const response = await getMenstrualCycleDates();
		//check error
		if ( response ) 
		{
			const markedDates: MarkedDates = {};
			response.forEach( menstrualCycleDates => 
			{
				markedDates[menstrualCycleDates.cycleStart] =
					{
						'color': '#D31D1D',
						'textColor': 'white',
						'startingDay': true,
						'endingDay': false
					};
				const dateBetween = new Date( menstrualCycleDates.cycleStart );
				dateBetween.setDate( dateBetween.getDate() + 1 );
				while ( dateBetween < new Date( menstrualCycleDates.cycleEnd ) ) 
				{
					const _dateBetween: string = dateBetween.toISOString().substring( 0, 10 );
					markedDates[_dateBetween] =
					{
						'color': '#D31D1D',
						'textColor': 'white',
						'startingDay': false,
						'endingDay': false
					};
					dateBetween.setDate( dateBetween.getDate() + 1 );
				}
				markedDates[menstrualCycleDates.cycleEnd] =
				{
					'color': '#D31D1D',
					'textColor': 'white',
					'startingDay': false,
					'endingDay': true
				};
				markedDates[menstrualCycleDates.ovulation] =
				{
					'color': '#eb34e5',
					'textColor': 'white',
					'startingDay': true,
					'endingDay': true
				};
				
			} );
			const startDate : string = ( response[response.length-1].cycleStart ).substring( 0,10 );
			const endDate : string = ( response[response.length-1].cycleEnd ).substring( 0,10 );
			const ovulation : string = ( response[response.length-1].ovulation ).substring( 0,10 );
			markedDates[startDate] =
			{
				'color': '#201dd3',
				'textColor': 'white',
				'startingDay': true,
				'endingDay': false
			};
			const dateBetween = new Date( startDate );
			dateBetween.setDate( dateBetween.getDate() + 1 );
			while ( dateBetween < new Date( endDate ) ) 
			{
				const _dateBetween: string = dateBetween.toISOString().substring( 0, 10 );
				markedDates[_dateBetween] =
					{
						'color': '#201dd3',
						'textColor': 'white',
						'startingDay': false,
						'endingDay': false
					};
				dateBetween.setDate( dateBetween.getDate() + 1 );
			}
			markedDates[endDate] =
			{
				'color': '#201dd3',
				'textColor': 'white',
				'startingDay': false,
				'endingDay': true
			};
			markedDates[ovulation] =
			{
				'color': '#541dd3',
				'textColor': 'white',
				'startingDay': true,
				'endingDay': true
			};
			setMarkedDatesArray( markedDates );
		}
	}

	return (
		<View>
			<Calendar
				onDayPress={date => 
				{
					setDayPressed( date );
					setPressed( true );
				}}
				markingType={'period'}
				markedDates={markedDatesArray}
				enableSwipeMonths
			/>
			{pressed && dayPressed && (
				<TouchableOpacity
					style={styles.container}
					onPress={() => setPressed( false )}
				>
					<View style={styles.container2}>
						{/* <OptionList
							date={dayPressed}
							setPressed={setPressed}
							getDateSettings={getDateSettings}
						/> */}
					</View>
				</TouchableOpacity>
			)}
		</View>
	);
};

const styles = StyleSheet.create( {
	container: {
		position: 'absolute',
		width: screen.width,
		height: screen.height - 100,
		backgroundColor: 'rgba(0,0,0,0.4)',
	},
	container2: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
} );

export default CalendarScreen;
