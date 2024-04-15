// Page for showing different analytics when clicking on a habit card

//import Chart from '@/Components/Charts/Chart'
import GoalsChart from '@/Components/Charts/GoalsChart/GoalsChart'
import { Button } from '@/Components/shadcnComponents/button'
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/Components/shadcnComponents/card'
import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { DeleteHabit } from '@/Api/api'
import { useToast } from '@/Components/shadcnComponents/use-toast'
import { ToastAction } from '@/Components/shadcnComponents/toast'

export default function AnalyticsPage() {
  // State to track saving process
  const [isLoading, setIsLoading] = useState(false) // State to track loading

  // Error handling
  const [errorMessage, setErrorMessage] = useState<string>('')

  // Get the current location
  const location = useLocation()

  // Destructure the values from the location state
  const { id, name, side } = location.state as { id: number; name: string; side: string; type: string }

  const navigate = useNavigate()

  // TODO: Replace the user ID with the actual user ID when users are implemented as well as device ID
  const userId = '0'

  const { toast } = useToast()

  async function deleteHabit(userId: string, habitId: number) {
    try {
      // Set loading to true
      setIsLoading(true)

      // API function
      await DeleteHabit(userId, habitId)

      // Navigate back to the main page
      navigate(`/my-habits`)

      // If successfull as confirmation toast will appear on the screen
      toast({
        variant: 'success',
        title: 'Success!',
        description: 'Your habit was deleted.',
      })
    } catch (error) {
      // Handle error
      setErrorMessage('Failed to delete habit. Please try again.')
    } finally {
      // Set loading to false when the loading finishes (whether successful or not)
      setIsLoading(false)
    }
  }

  // Navigate to the "add goal" page
  function goToAddGoalPage() {
    // Functionality for sending the user to the page for adding goals
    navigate(`${location.pathname}/addGoal`, { state: { name: name } })
  }

  // Navigate to the "edit habit" page
  function goToEditHabitPage() {
    // Functionality for sending the user to the page for changing their habit
    navigate(`${location.pathname}/editHabit`, { state: { id: id, name: name, side: side } })
  }

  // Temp variable for holding information about whether there exist a goal
  const [goalExist, setgoalExist] = useState<boolean>(true)

  // Function to handle editing a goal
  const handleEditGoal = () => {
    // TODO: create function for editing a goal
  }

  // Function to handle deleting a goal
  const handleDeleteGoal = () => {
    setgoalExist(false)
    // TODO: create function for deleting the goal in backend
  }

  return (
    <div className="flex flex-col m-5">
      {/* Heading with the habit's name */}
      <div className="flex justify-between">
        <h1 className="text-4xl font-bold leading-tight overflow-hidden text-slate-900">{name}</h1>
        <Button className={`ml-4 ${goalExist ? 'hidden' : 'visible'}`} onClick={goToAddGoalPage}>
          Add Goal
        </Button>
      </div>
      {/* Card for displaying goal chart */}
      <Card className={`w-[100%] mx-auto ${goalExist ? 'visible' : 'hidden'}`}>
        <CardHeader>
          <CardTitle>Goal</CardTitle>
          <CardDescription>Your goal for this habit</CardDescription>
        </CardHeader>
        {/* Sample data => to be replaced */}
        <CardContent>
          {
            <GoalsChart
              today={1}
              week={7}
              target={14}
              question={'How many hours did i hug threes?'}
              frequency={'week'}
            />
          }
        </CardContent>
        <CardFooter className="flex flex-row justify-between">
          <Button variant="secondary" onClick={handleEditGoal}>
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDeleteGoal}>
            Delete
          </Button>
        </CardFooter>
      </Card>
      {/* Card for displaying history chart */}
      <Card className="w-[100%] mx-auto">
        <CardHeader>
          <CardTitle>History</CardTitle>
          <CardDescription>Your history for this habit</CardDescription>
        </CardHeader>
        <CardContent>{/* <Chart></Chart> */}</CardContent>
      </Card>
      {/* Example card */}
      <Card className="w-[100%] mx-auto">
        <CardHeader>
          <CardTitle>Example card</CardTitle>
        </CardHeader>
        <CardContent>Just to show what is possible and how it will look</CardContent>
      </Card>
      {/* Error message */}
      {errorMessage && <p className="text-red-500 m-5">{errorMessage}</p>}
      <div className="flex justify-between">
        {/* Button to edit habit */}
        <Button onClick={goToEditHabitPage}>Edit Habit</Button>
        {/* Button to delete habit */}
        {/* TODO: Make this functional */}
        {isLoading ? (
          <p>Deleting habit...</p>
        ) : (
          <Button
            variant="destructive"
            onClick={() => {
              toast({
                variant: 'destructive',
                title: 'Confirm your action',
                description: `Are you sure you want to delete ${name}?`,
                action: (
                  // TODO: Make it more visually appealing
                  <ToastAction
                    altText="Yes"
                    onClick={() => {
                      deleteHabit(userId, id)
                    }}
                  >
                    Yes
                  </ToastAction>
                ),
              })
            }}
          >
            Delete Habit
          </Button>
        )}
      </div>
    </div>
  )
}
